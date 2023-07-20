import type { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';

export const widgetSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  width: z.enum(['half', 'full']).default('half'),
  order: z.number(),
  type: z.enum(['chart', 'calendar', 'heatmapCalendar', 'dailyExerciseCalendar']).default('chart'),
  isTemplate: z.boolean(),
  sets: z.number().nullish(),
  reps: z.number().nullish(),
  weight: z.number().nullish(),
  seconds: z.number().nullish(),
  minutes: z.number().nullish(),
  trainingProgramId: z.number().nullish(),
});
export type WidgetSchema = typeof widgetSchema;

export const widgetTemplateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});
export type WidgetTemplateSchema = typeof widgetTemplateSchema;

export const datasetSchema = z.object({
  type: z.enum(['line', 'bar']).default('line'),
  color: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
});
export type DatasetSchema = typeof datasetSchema;

export class WidgetRepo {
  constructor(private readonly prisma: PrismaClient) {}
  async new(data: z.infer<WidgetSchema>, ownerId: string) {
    return await this.prisma.widget.create({
      data: {
        ...data,
        ownerId: ownerId,
        createdAt: new Date(),
      },
    });
  }

  // Create a new template from a given widget
  async newTemplate(data: z.infer<WidgetTemplateSchema>, id: string, ownerId: string) {
    const source = await this.getOneAndValidateOwner(id, ownerId);
    return await this.prisma.widget.create({
      data: {
        ...source,
        ...data,
        owner: undefined,
        id: undefined,
        trainingProgramId: undefined,
        trainingProgram: undefined,
        isTemplate: true,
        datasets: {
          create: source.datasets.map((d) => {
            return {
              ...d,
              id: undefined,
              widgetId: undefined,
              customQueries: {
                create: d.customQueries.map((customQuery) => {
                  return {
                    ...customQuery,
                    id: undefined,
                    datasetId: undefined,
                    conditions: {
                      create: customQuery.conditions.map((condition) => ({
                        ...condition,
                        id: undefined,
                        customQueryId: undefined,
                      })),
                    },
                  };
                }),
              },
            };
          }),
        },
      },
    });
  }

  async get(where: Prisma.WidgetWhereInput) {
    return await this.prisma.widget.findMany({
      where,
      orderBy: {
        order: 'asc',
      },
      include: {
        owner: true,
        datasets: {
          include: {
            customQueries: {
              include: {
                conditions: true,
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
        trainingProgram: {
          include: {
            exerciseGroups: {
              include: {
                exercises: {
                  orderBy: {
                    name: 'asc',
                  },
                },
              },
              orderBy: {
                name: 'asc',
              },
            },
            days: {
              include: {
                exercises: {
                  orderBy: {
                    name: 'asc',
                  },
                },
                exerciseGroups: {
                  orderBy: {
                    name: 'asc',
                  },
                  include: {
                    exercises: {
                      orderBy: {
                        name: 'asc',
                      },
                    },
                  },
                },
              },
              orderBy: {
                // Note: ui depends on this being sorted in this way
                dayOfTheWeek: 'asc',
              },
            },
          },
        },
      },
    });
  }

  async getOne(id: string) {
    const widget = await this.prisma.widget.findUnique({
      where: {
        id,
      },
      include: {
        owner: true,
        datasets: {
          include: {
            customQueries: {
              include: {
                conditions: true,
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
        trainingProgram: true,
      },
    });
    if (widget == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    return widget;
  }

  // Only returns successfully if you are the owner of this widget
  async getOneAndValidateOwner(id: string, ownerId: string) {
    const widget = await this.getOne(id);
    if (widget.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
    }

    return widget;
  }

  async update(data: z.infer<WidgetSchema>, id: string, ownerId: string) {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.widget.update({
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

    return await this.prisma.widget.delete({
      where: {
        id,
      },
    });
  }

  async addDataset(data: z.infer<DatasetSchema>, id: string, ownerId: string) {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.widget.update({
      data: {
        datasets: {
          create: {
            ...data,
            ownerId,
          },
        },
      },
      where: {
        id,
      },
    });
  }

  async updateDataset(
    data: z.infer<DatasetSchema>,
    widgetId: string,
    datasetId: string,
    ownerId: string
  ) {
    await this.getOneAndValidateOwner(widgetId, ownerId);

    return await this.prisma.widget.update({
      data: {
        datasets: {
          update: {
            data,
            where: {
              id: datasetId,
            },
          },
        },
      },
      where: {
        id: widgetId,
      },
    });
  }

  async deleteDataset(widgetId: string, datasetId: string, ownerId: string) {
    await this.getOneAndValidateOwner(widgetId, ownerId);

    return await this.prisma.widget.update({
      data: {
        datasets: {
          delete: {
            id: datasetId,
          },
        },
      },
      where: {
        id: widgetId,
      },
    });
  }
}
