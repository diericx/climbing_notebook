import type { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';

export const widgetSchemaBase = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().nullish(),
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
  parentId: z.string().nullish(),
  isPublished: z.boolean().optional(),
});
export const widgetSchemaBasePartial = widgetSchemaBase.partial();

// Split out the refinement function so we can reuse it to compose a partial schema
// below
function refinementFunc(
  val: z.infer<typeof widgetSchemaBase> | z.infer<typeof widgetSchemaBasePartial>,
  ctx: z.RefinementCtx
) {
  if (val.isTemplate) {
    if (!val.description) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Description is required`,
        path: ['description'],
      });
    }
  }
}
export const widgetSchema = widgetSchemaBase.superRefine(refinementFunc);
export type WidgetSchema = typeof widgetSchema;

export const widgetSchemaPartial = widgetSchemaBasePartial.superRefine(refinementFunc);
export type WidgetSchemaPartial = typeof widgetSchemaPartial;

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

export const widgetInclude = {
  owner: true,
  datasets: {
    include: {
      customQueries: {
        include: {
          conditions: true,
          exercise: {
            select: {
              name: true,
            },
          },
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
} satisfies Prisma.WidgetInclude;

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
        isPublished: true,
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

  async getOne(id: string) {
    const widget = await this.prisma.widget.findUnique({
      where: {
        id,
      },
      include: widgetInclude,
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

  async getAllPublishedOrOwnedTemplates<S extends Prisma.WidgetInclude>(
    ownerId: string,
    include: Prisma.Subset<S, Prisma.WidgetInclude>
  ) {
    return await this.prisma.widget.findMany({
      where: {
        // Show published widgets, or just user's widgets
        OR: [
          {
            isTemplate: true,
            ownerId: ownerId,
          },
          {
            isTemplate: true,
            isPublished: true,
          },
        ],
      },
      orderBy: {
        useCount: 'desc',
      },
      include: include || {},
    });
  }

  async getAllDashboardWidgetsForUser<S extends Prisma.WidgetInclude>(
    ownerId: string,
    include: Prisma.Subset<S, Prisma.WidgetInclude>
  ) {
    return await this.prisma.widget.findMany({
      where: {
        isTemplate: false,
        ownerId: ownerId,
      },
      orderBy: {
        order: 'asc',
      },
      include,
    });
  }

  async update(data: z.infer<WidgetSchemaPartial>, id: string, ownerId: string) {
    const widget = await this.getOneAndValidateOwner(id, ownerId);

    // Check to make sure we aren't removing a field that is currently in use
    if (
      (data.sets === null && isSimpleFieldInUse(widget, 'sets')) ||
      (data.reps === null && isSimpleFieldInUse(widget, 'reps')) ||
      (data.minutes === null && isSimpleFieldInUse(widget, 'minutes')) ||
      (data.seconds === null && isSimpleFieldInUse(widget, 'seconds')) ||
      (data.weight === null && isSimpleFieldInUse(widget, 'weight'))
    ) {
      throw new APIError('INVALID_INPUT', 'There are conditions depending on this field');
    }

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

  async duplicateTemplateAsDashboardWidget(widgetId: string, userId: string) {
    const sourceWidget = await this.getOne(widgetId);
    // Can only be done on templates
    if (!sourceWidget.isTemplate) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
    }

    await this.prisma.$transaction([
      this.prisma.widget.update({
        where: {
          id: sourceWidget.id,
        },
        data: {
          useCount: sourceWidget.useCount + 1,
        },
      }),
      this.prisma.widget.create({
        data: {
          ...sourceWidget,
          id: undefined,
          trainingProgramId: undefined,
          trainingProgram: undefined,
          ownerId: undefined,
          parentId: sourceWidget.id,
          isTemplate: false,
          owner: {
            connect: {
              id: userId,
            },
          },
          datasets: {
            create: sourceWidget.datasets.map((dataset) => ({
              ...dataset,
              id: undefined,
              widgetId: undefined,
              ownerId: userId,
              customQueries: {
                create: dataset.customQueries.map((customQuery) => ({
                  ...customQuery,
                  id: undefined,
                  ownerId: userId,
                  datasetId: undefined,
                  exerciseId: undefined,
                  exercise: customQuery.exerciseId
                    ? {
                        connect: {
                          id: customQuery.exerciseId,
                        },
                      }
                    : undefined,
                  conditions: {
                    create: customQuery.conditions.map((condition) => ({
                      ...condition,
                      ownerId: userId,
                      id: undefined,
                      customQueryId: undefined,
                    })),
                  },
                })),
              },
            })),
          },
        },
      }),
    ]);
  }
}

export function isSimpleFieldInUse(
  widget: Prisma.WidgetGetPayload<{
    include: {
      datasets: {
        include: {
          customQueries: {
            include: {
              conditions: true;
            };
          };
        };
      };
    };
  }>,
  field: string
) {
  return (
    widget.datasets.find((d) =>
      d.customQueries.find((q) =>
        q.conditions.find((c) => c.useWidgetField === true && c.widgetFieldToUse === field)
      )
    ) !== undefined
  );
}
