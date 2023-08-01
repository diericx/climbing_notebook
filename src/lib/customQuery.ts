import type { PrismaClient, CustomQuery, ExerciseEvent, Metric } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';

export const customQuerySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  table: z.enum(['metric', 'exerciseEvent']).default('exerciseEvent'),
  equation: z.string().min(1, { message: 'Equation is required' }),
  metric: z.string().nullish(),
  exerciseId: z.string().nullish(),
});
export type CustomQuerySchema = typeof customQuerySchema;

export const customQueryConditionSchema = z.object({
  column: z.string().min(1, { message: 'Column is required' }),
  condition: z.enum(['equals', 'contains']).default('contains'),
  useWidgetField: z.boolean().default(false),
  widgetFieldToUse: z.string().nullish(),
  value: z.number(),
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
        exercise: {
          connect: {
            id: data.exerciseId,
          },
        },
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
      },
    });
    type QueryWithWidget = Prisma.CustomQueryGetPayload<typeof queryWithWidget>;
    // Get the widget
    const query = (await this.getOne(id, {
      dataset: { include: { widget: true } },
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

    const prismaQuery = { where: { ownerId }, orderBy: { date: 'asc' } };
    prismaQuery.where['AND'] = query.conditions.map((c) => {
      const prismaCondition = {};
      prismaCondition[c.column] = {};
      // use the value from the parent widget if enabled
      if (c.useWidgetField) {
        prismaCondition[c.column][c.condition] = query.dataset.widget[c.column];
      } else {
        prismaCondition[c.column][c.condition] = c.value;
      }
      return prismaCondition;
    });

    // Filter out exercise events in programs in an admittedly confusing double negative way
    if (query.table == 'exerciseEvent') {
      prismaQuery.where['NOT'] = [
        {
          trainingProgramDayId: {
            not: null,
          },
        },
        {
          exerciseGroupId: {
            not: null,
          },
        },
      ];
    }
    return await this.prisma[query.table].findMany(prismaQuery);
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
