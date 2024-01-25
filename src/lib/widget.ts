import { Prisma, type PrismaClient, type Widget } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';
import type { Repo } from './repo';
import { TrainingCycleRepo } from './trainingCycle';

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
  trainingCycleId: z.number().nullish(),
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

export class WidgetRepo implements Repo<Widget, Prisma.WidgetSelect> {
  constructor(private readonly prisma: PrismaClient) {}

  static makeSelect<T extends Prisma.WidgetSelect>(
    select: Prisma.Subset<T, Prisma.WidgetSelect>
  ): T {
    return select;
  }

  static selectEverything = this.makeSelect({
    id: true,
    useCount: true,
    isPublished: true,
    isTemplate: true,
    name: true,
    description: true,
    ownerId: true,
    width: true,
    order: true,
    type: true,
    sets: true,
    reps: true,
    weight: true,
    minutes: true,
    seconds: true,
    owner: {
      select: {
        username: true,
        profile: {
          select: {
            imageS3ObjectKey: true,
          },
        },
      },
    },
    datasets: {
      select: {
        id: true,
        type: true,
        color: true,
        name: true,
        widgetId: true,
        customQueries: {
          select: {
            name: true,
            datasetId: true,
            id: true,
            table: true,
            equation: true,
            metric: true,
            conditions: true,
            exerciseId: true,
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
    trainingCycle: {
      select: TrainingCycleRepo.selectEverything,
    },
  });
  static selectEverythingValidator = Prisma.validator<Prisma.WidgetDefaultArgs>()({
    select: WidgetRepo.selectEverything,
  });

  canUserRead(
    userId: string | undefined,
    widget: Prisma.WidgetGetPayload<{
      select: { ownerId: true; isPublished: true };
    }>
  ) {
    // if it is public anyone can read
    if (widget.isPublished) {
      return true;
    }
    // owner can always read
    if (userId !== undefined) {
      if (widget.ownerId == userId) {
        return true;
      }
    }
    return false;
  }

  canUserUpdate(
    userId: string | undefined,
    widget: Prisma.WidgetGetPayload<{
      select: { ownerId: true };
    }>
  ) {
    return widget.ownerId == userId;
  }

  canUserDelete(
    userId: string | undefined,
    widget: Prisma.WidgetGetPayload<{
      select: { ownerId: true };
    }>
  ) {
    return widget.ownerId == userId;
  }

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
  async newTemplate(data: z.infer<WidgetTemplateSchema>, id: string, userId: string) {
    const source = await this.getOne({
      id,
      userId,
      select: WidgetRepo.selectEverything,
    });
    if (!this.canUserUpdate(userId, source)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return await this.prisma.widget.create({
      data: {
        ...source,
        ...data,
        owner: undefined,
        id: undefined,
        trainingCycleId: undefined,
        trainingCycle: undefined,
        isTemplate: true,
        isPublished: true,
        datasets: {
          create: source.datasets.map((d) => {
            return {
              ...d,
              id: undefined,
              widgetId: undefined,
              ownerId: userId,
              customQueries: {
                create: d.customQueries.map((customQuery) => {
                  return {
                    ...customQuery,
                    ownerId: userId,
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

  async getOne<S extends Prisma.WidgetSelect>(options: { id: string; userId?: string; select: S }) {
    const { id, userId, select } = options;
    const widget = await this.prisma.widget.findUnique({
      where: {
        id,
      },
      select: { ...select, ownerId: true, isPublished: true } as S,
    });
    if (widget == null) {
      throw new APIError('NOT_FOUND');
    }

    const _widget = widget as Prisma.WidgetGetPayload<{
      select: S;
    }> &
      Prisma.WidgetGetPayload<{
        select: { ownerId: true; isPublished: true };
      }>;
    if (!this.canUserRead(userId, _widget)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return _widget;
  }

  async getManyForUserPublishedOrOwnedTemplates<S extends Prisma.WidgetSelect>(
    userId: string,
    select: S
  ) {
    return await this.prisma.widget.findMany({
      where: {
        // Show published widgets, or just user's widgets
        OR: [
          {
            isTemplate: true,
            ownerId: userId,
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
      select,
    });
  }

  async getManyForUserDashboardWidgets<S extends Prisma.WidgetSelect>(ownerId: string, select: S) {
    return await this.prisma.widget.findMany({
      where: {
        isTemplate: false,
        ownerId: ownerId,
      },
      orderBy: {
        order: 'asc',
      },
      select,
    });
  }

  async update(data: z.infer<WidgetSchemaPartial>, id: string, userId: string) {
    const widget = await this.getOne({
      id,
      userId,
      select: {
        datasets: {
          ...WidgetRepo.selectEverything.datasets,
        },
      },
    });
    if (!this.canUserUpdate(userId, widget)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

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

  async delete(id: string, userId: string) {
    const widget = await this.getOne({
      id,
      userId,
      select: {},
    });
    if (!this.canUserDelete(userId, widget)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return await this.prisma.widget.delete({
      where: {
        id,
      },
    });
  }

  async addDataset(data: z.infer<DatasetSchema>, id: string, userId: string) {
    const widget = await this.getOne({
      id,
      userId,
      select: {},
    });
    if (!this.canUserUpdate(userId, widget)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return await this.prisma.widget.update({
      data: {
        datasets: {
          create: {
            ...data,
            ownerId: userId,
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
    userId: string
  ) {
    const widget = await this.getOne({
      id: widgetId,
      userId,
      select: {},
    });
    if (!this.canUserUpdate(userId, widget)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

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

  async deleteDataset(widgetId: string, datasetId: string, userId: string) {
    const widget = await this.getOne({
      id: widgetId,
      userId,
      select: {},
    });
    if (!this.canUserUpdate(userId, widget)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

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
    const sourceWidget = await this.getOne({
      id: widgetId,
      userId,
      select: WidgetRepo.selectEverything,
    });

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
          trainingCycleId: undefined,
          trainingCycle: undefined,
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
    select: {
      datasets: {
        select: {
          customQueries: {
            select: {
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
