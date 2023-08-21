import type { CustomQuery, ExerciseEvent, Metric, PrismaClient, Widget } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { evaluate } from 'mathjs';
import { z } from 'zod';
import { APIError } from './errors';

export const customQuerySchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    table: z.enum(['metric', 'exerciseEvent']).default('exerciseEvent'),
    equation: z.string().min(1, { message: 'Equation is required' }),
    metric: z.string().nullish(),
    exerciseId: z.string().nullish(),
  })
  .superRefine((val, ctx) => {
    if (val.table == 'exerciseEvent' && !val.exerciseId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Exercise is required`,
        path: ['exercise'],
      });
    }
    if (val.table == 'metric' && !val.metric) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Metric is required`,
        path: ['metric'],
      });
    }
    // Check if equation is valid by attempting to solve the equation
    try {
      if (val.table == 'exerciseEvent') {
        evaluate(val.equation, {
          sets: 0,
          reps: 0,
          weight: 0,
          minutes: 0,
          seconds: 0,
        });
      } else if (val.table == 'metric') {
        evaluate(val.equation, {
          value: 0,
        });
      }
    } catch (e: any) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: e.toString(),
        path: ['equation'],
      });
    }
  });
export type CustomQuerySchema = typeof customQuerySchema;

export const customQueryConditionSchema = z
  .object({
    column: z.string().min(1, { message: 'Column is required' }),
    condition: z.enum(['equals', 'contains']).default('contains'),
    useWidgetField: z.boolean().default(false).optional(),
    widgetFieldToUse: z.string().nullish(),
    value: z.number(),
  })
  .superRefine((val, ctx) => {
    // If useWidgetField is set to false, set the widgetFieldToUse to null
    // so that we don't have a potential dangling reference to a field on the
    // widget that may possibly have been removed by another action
    if (val.useWidgetField === false) {
      val.widgetFieldToUse = null;
    }

    if (val.useWidgetField === true && val.widgetFieldToUse === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Must specify a widget field to use',
        path: ['widgetFieldToUse'],
      });
    }
  });
export type CustomQueryConditionSchema = typeof customQueryConditionSchema;

export type CustomQueryResults = {
  customQueryId: string;
  data: ExerciseEvent[] | Metric[];
};

export class CustomQueryRepo {
  constructor(private readonly prisma: PrismaClient) {}
  async new(data: z.infer<CustomQuerySchema>, datasetId: string, ownerId: string) {
    return (await this.prisma.customQuery.create({
      data: {
        ...data,
        exerciseId: undefined,
        exercise: data.exerciseId
          ? {
              connect: {
                id: data.exerciseId,
              },
            }
          : undefined,
        dataset: {
          connect: {
            id: datasetId,
          },
        },
        ownerId: ownerId,
        createdAt: new Date(),
      },
    })) as CustomQuery;
  }

  async runCustomQuery(id: string, ownerId: string) {
    // Set up types for this one off query
    const queryWithWidget = Prisma.validator<Prisma.CustomQueryArgs>()({
      include: {
        dataset: {
          include: {
            widget: true,
          },
        },
        conditions: true,
      },
    });
    type QueryWithWidget = Prisma.CustomQueryGetPayload<typeof queryWithWidget>;
    // Get the widget
    const query = (await this.getOne(id, {
      dataset: { include: { widget: true } },
      conditions: true,
    })) as QueryWithWidget;

    // Permissions: if it is not a template, only the owner can run the query
    if (!query.dataset.widget.isTemplate) {
      if (query.ownerId != ownerId) {
        throw new APIError(
          'INVALID_PERMISSIONS',
          'You do not have permission to edit this object.'
        );
      }
    }

    // Initialize query values for each case
    if (query.table == 'exerciseEvent') {
      return this.prisma.exerciseEvent.findMany({
        where: {
          ownerId,
          // Add each query condition
          AND: [
            ...query.conditions.map((c) => ({
              [c.column]: {
                [c.condition]: c.useWidgetField
                  ? query.dataset.widget[c.widgetFieldToUse as keyof Widget]
                  : c.value,
              },
            })),
            // Add filter for exercise
            { exerciseId: query.exerciseId },
          ],
          // Filter out exercise events that are *in* training programs
          // in an admittedly confusing double negative way
          NOT: [
            {
              trainingCycleDayId: {
                not: null,
              },
            },
            {
              exerciseGroupId: {
                not: null,
              },
            },
          ],
        },
        orderBy: { date: 'asc' },
      });
    } else if (query.table == 'metric') {
      return await this.prisma.metric.findMany({
        where: {
          ownerId,
          AND: [
            // Add each query condition
            ...query.conditions.map((c) => {
              return {
                [c.column]: {
                  [c.condition]: c.useWidgetField
                    ? query.dataset.widget[c.column as keyof Widget]
                    : c.value,
                },
              };
            }),
            // Add filter for the metric name
            { name: query.metric || '' },
          ],
        },
        orderBy: { date: 'asc' },
      });
    } else {
      throw new APIError('INVALID_INPUT', `Unrecognized table "${query.table}"`);
    }
  }

  async get(ownerId: string) {
    return await this.prisma.customQuery.findMany({
      where: {
        ownerId: ownerId,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        conditions: true,
        exercise: true,
      },
    });
  }

  async getOne(id: string, include: Prisma.CustomQueryInclude = {}) {
    const query = await this.prisma.customQuery.findUnique({
      where: {
        id,
      },
      include: {
        conditions: true,
        exercise: true,
        ...include,
        dataset: {
          include: {
            widget: true,
          },
        },
      },
    });
    if (query == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    return query;
  }
  async getOneAndValidateOwner(id: string, ownerId: string) {
    const query = await this.getOne(id);
    if (query.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
    }

    return query;
  }

  async update(data: z.infer<CustomQuerySchema>, id: string, ownerId: string) {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.customQuery.update({
      data: {
        ...data,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: string, ownerId: string) {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.customQuery.delete({
      where: {
        id,
      },
    });
  }

  async addCondition(data: z.infer<CustomQueryConditionSchema>, id: string, ownerId: string) {
    await this.getOneAndValidateOwner(id, ownerId);
    return await this.prisma.customQuery.update({
      data: {
        conditions: {
          create: [
            {
              ...data,
              ownerId: ownerId,
              createdAt: new Date(),
            },
          ],
        },
      },
      where: {
        id,
      },
    });
  }

  async deleteCondition(queryId: string, conditionId: string, ownerId: string) {
    await this.getOneAndValidateOwner(queryId, ownerId);
    return (await this.prisma.customQuery.update({
      data: {
        conditions: {
          delete: {
            id: conditionId,
          },
        },
      },
      where: {
        id: queryId,
      },
    })) as CustomQuery;
  }

  async updateCondition(
    data: z.infer<CustomQueryConditionSchema>,
    queryId: string,
    conditionId: string,
    ownerId: string
  ) {
    await this.getOneAndValidateOwner(queryId, ownerId);
    return (await this.prisma.customQuery.update({
      data: {
        conditions: {
          update: {
            where: {
              id: conditionId,
            },
            data,
          },
        },
      },
      where: {
        id: queryId,
      },
    })) as CustomQuery;
  }
}
