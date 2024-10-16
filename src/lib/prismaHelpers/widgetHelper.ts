import { Prisma } from '@prisma/client';
import { trainingCycleSelects } from './trainingCycleHelper';

function isSimpleFieldInUse(
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
  field: string,
) {
  return (
    widget.datasets.find((d) =>
      d.customQueries.find((q) =>
        q.conditions.find((c) => c.useWidgetField === true && c.widgetFieldToUse === field),
      ),
    ) !== undefined
  );
}

function makeSelect<T extends Prisma.WidgetSelect>(
  select: Prisma.Subset<T, Prisma.WidgetSelect>,
): T {
  return select;
}

const selectEverything = makeSelect({
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
    select: trainingCycleSelects.everything,
  },
});
const selectEverythingValidator = Prisma.validator<Prisma.WidgetDefaultArgs>()({
  select: selectEverything,
});

const widgetSelects = {
  everything: selectEverything,
  everythingValidator: selectEverythingValidator,
};

export { widgetSelects, isSimpleFieldInUse };
