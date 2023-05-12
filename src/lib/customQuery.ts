import type { PrismaClient, CustomQuery, ExerciseEvent, Metric } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';

export const customQuerySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  table: z.enum(['metric', 'exerciseEvent']).default('exerciseEvent'),
  operator: z.enum(['AND', 'OR']).default('AND'),
});
export type CustomQuerySchema = typeof customQuerySchema;

export const customQueryConditionSchema = z.object({
  column: z.string().min(1, { message: 'Column is required' }),
  condition: z.enum(['equals', 'contains']).default('contains'),
  value: z.string(),
});
export type CustomQueryConditionSchema = typeof customQueryConditionSchema;

export type CustomQueryResults = {
  customQueryId: string,
  data: ExerciseEvent[] | Metric[],
}

export class CustomQueryRepo {
  constructor(private readonly prisma: PrismaClient) { }
  async new(data: z.infer<CustomQuerySchema>, ownerId: string): Promise<CustomQuery> {
    return await this.prisma.customQuery.create({
      data: {
        ...data,
        ownerId: ownerId,
        createdAt: new Date(),
      },
    }) as CustomQuery;
  }

  async runCustomQuery(id: string, ownerId: string) {
    const query = await this.getOneAndValidateOwner(id, ownerId)
    const prismaQuery = { where: {}, orderBy: { date: 'asc' } };
    prismaQuery.where[query.operator] = query.conditions.map(c => {
      const prismaCondition = {};
      prismaCondition[c.column] = {}
      prismaCondition[c.column][c.condition] = c.value;
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
          }
        }]
    }
    return await this.prisma[query.table].findMany(prismaQuery);
  }
  async get(ownerId: string): Promise<CustomQuery[]> {
    return await this.prisma.customQuery.findMany({
      where: {
        ownerId: ownerId,
      },
      orderBy: {
        name: 'asc',
      },
    }) as CustomQuery[];
  }

  async getOneAndValidateOwner(id: string, ownerId: string) {
    const query = await this.prisma.customQuery.findUnique({
      where: {
        id
      },
      include: {
        conditions: true
      }
    });
    if (query == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (query.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.')
    }

    return query;
  }

  async update(data: z.infer<CustomQuerySchema>, id: string, ownerId: string): Promise<CustomQuery> {
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

  async delete(id: string, ownerId: string): Promise<CustomQuery> {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.customQuery.delete({
      where: {
        id
      }
    });
  }

  async addCondition(data: z.infer<CustomQueryConditionSchema>, id: string, ownerId: string): Promise<CustomQuery> {
    await this.getOneAndValidateOwner(id, ownerId)
    return await this.prisma.customQuery.update({
      data: {
        conditions: {
          create: [
            {
              ...data,
              ownerId: ownerId,
              createdAt: new Date(),
            }
          ]
        }
      },
      where: {
        id,
      }
    }) as CustomQuery;
  }

  async deleteCondition(queryId: string, conditionId: string, ownerId: string): Promise<CustomQuery> {
    await this.getOneAndValidateOwner(queryId, ownerId)
    return await this.prisma.customQuery.update({
      data: {
        conditions: {
          delete: {
            id: conditionId,
          }
        }
      },
      where: {
        id: queryId,
      }
    }) as CustomQuery;
  }

  async updateCondition(data: z.infer<CustomQueryConditionSchema>, queryId: string, conditionId: string, ownerId: string): Promise<CustomQuery> {
    await this.getOneAndValidateOwner(queryId, ownerId)
    return await this.prisma.customQuery.update({
      data: {
        conditions: {
          update: {
            where: {
              id: conditionId,
            },
            data,
          }
        }
      },
      where: {
        id: queryId,
      }
    }) as CustomQuery;
  }
}
