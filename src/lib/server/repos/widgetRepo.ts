import { isSimpleFieldInUse, widgetSelects } from '$lib/prismaHelpers/widgetHelper';
import type { Prisma, PrismaClient, Widget } from '@prisma/client';
import type { z } from 'zod';
import { APIError } from '../../errors';
import type {
  DatasetSchema,
  WidgetSchema,
  WidgetSchemaPartial,
  WidgetTemplateSchema,
} from '../../zodSchemas';
import type { Repo } from './repo';

export class WidgetRepo implements Repo<Widget, Prisma.WidgetSelect> {
  constructor(private readonly prisma: PrismaClient) {}

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
      select: widgetSelects.everything,
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
          ...widgetSelects.everything.datasets,
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
      select: widgetSelects.everything,
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
