import type { Prisma } from '@prisma/client';

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
