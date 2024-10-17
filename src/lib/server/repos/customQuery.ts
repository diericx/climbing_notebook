import type {
  CustomQuery,
  ExerciseEvent,
  Metric,
  Prisma,
  PrismaClient,
  Widget,
} from '@prisma/client';
import type { z } from 'zod';
import { APIError } from '../../errors';
import type { CustomQueryConditionSchema, CustomQuerySchema } from '../../zodSchemas';
import type { Repo } from './repo';

export type CustomQueryResults = {
  customQueryId: string;
  data: ExerciseEvent[] | Metric[];
};

export class CustomQueryRepo implements Repo<CustomQuery, Prisma.CustomQuerySelect> {
  constructor(private readonly prisma: PrismaClient) {}

  canUserRead(
    userId: string | undefined,
    customQuery: Prisma.CustomQueryGetPayload<{
      select: { ownerId: true };
    }>,
  ) {
    return customQuery.ownerId == userId;
  }

  canUserUpdate(
    userId: string | undefined,
    customQuery: Prisma.CustomQueryGetPayload<{
      select: { ownerId: true };
    }>,
  ) {
    return customQuery.ownerId == userId;
  }

  canUserDelete(
    userId: string | undefined,
    customQuery: Prisma.CustomQueryGetPayload<{
      select: { ownerId: true };
    }>,
  ) {
    return customQuery.ownerId == userId;
  }

  async new(data: z.infer<CustomQuerySchema>, datasetId: string, userId: string) {
    // throw new APIError('INVALID_ACTION');
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
        ownerId: userId,
        createdAt: new Date(),
      },
    })) as CustomQuery;
  }

  async getOne<S extends Prisma.CustomQuerySelect>(options: {
    id: string;
    userId: string;
    select: S;
  }) {
    const { id, userId, select } = options;
    const customQuery = await this.prisma.customQuery.findUnique({
      where: {
        id,
      },
      select: { ...select, ownerId: true } as S,
    });
    if (customQuery == null) {
      throw new APIError('NOT_FOUND');
    }

    const _customQuery = customQuery as Prisma.CustomQueryGetPayload<{
      select: S;
    }> &
      Prisma.CustomQueryGetPayload<{
        select: { ownerId: true };
      }>;

    if (!this.canUserRead(userId, _customQuery)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return _customQuery;
  }

  async getManyForUser<S extends Prisma.CalendarEventSelect>(options: {
    userId: string;
    select: S;
  }) {
    const { userId, select } = options;
    // Fetch all
    return await this.prisma.trainingCycle.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        name: 'asc',
      },
      select,
    });
  }

  async update(data: z.infer<CustomQuerySchema>, id: string, userId: string) {
    const customQuery = await this.getOne({ id, userId, select: {} });
    if (!this.canUserUpdate(userId, customQuery)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return await this.prisma.customQuery.update({
      data: {
        ...data,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: string, userId: string) {
    const customQuery = await this.getOne({ id, userId, select: {} });
    if (!this.canUserDelete(userId, customQuery)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return await this.prisma.customQuery.delete({
      where: {
        id,
      },
    });
  }

  async runCustomQuery(id: string, userId: string) {
    // Get the widget
    const query = await this.getOne({
      id,
      userId,
      select: {
        table: true,
        exerciseId: true,
        metric: true,
        dataset: { select: { widget: true } },
        conditions: true,
      },
    });

    // Permissions: if it is not a template, only the owner can run the query
    if (!query.dataset.widget.isTemplate) {
      if (query.ownerId != userId) {
        throw new APIError(
          'INVALID_PERMISSIONS',
          'You do not have permission to edit this object.',
        );
      }
    }

    // Initialize query values for each case
    if (query.table == 'exerciseEvent') {
      return this.prisma.exerciseEvent.findMany({
        where: {
          ownerId: userId,
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
          ownerId: userId,
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

  async addCondition(data: z.infer<CustomQueryConditionSchema>, id: string, userId: string) {
    const customQuery = await this.getOne({ id, userId, select: {} });
    if (!this.canUserUpdate(userId, customQuery)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return await this.prisma.customQuery.update({
      data: {
        conditions: {
          create: [
            {
              ...data,
              ownerId: userId,
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

  async deleteCondition(queryId: string, conditionId: string, userId: string) {
    const customQuery = await this.getOne({ id: queryId, userId, select: {} });
    if (!this.canUserUpdate(userId, customQuery)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

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
    userId: string,
  ) {
    const customQuery = await this.getOne({ id: queryId, userId, select: {} });
    if (!this.canUserUpdate(userId, customQuery)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

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
