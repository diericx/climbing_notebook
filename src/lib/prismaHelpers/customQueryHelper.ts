import type { ExerciseEvent, Metric } from '@prisma/client';
import { Prisma } from '@prisma/client';

export type CustomQueryResults = {
  customQueryId: string;
  data: ExerciseEvent[] | Metric[];
};

function makeSelect<T extends Prisma.CustomQuerySelect>(
  select: Prisma.Subset<T, Prisma.CustomQuerySelect>,
): T {
  return select;
}

const selectEverything = makeSelect({
  id: true,
  ownerId: true,
  name: true,
  table: true,
  equation: true,
  metric: true,
  conditions: true,
  dataset: true,
  createdAt: true,
  exercise: true,
});
const selectEverythingValidator = Prisma.validator<Prisma.CustomQueryDefaultArgs>()({
  select: selectEverything,
});

const customQuerySelects = {
  everything: selectEverything,
  everythingValidator: selectEverythingValidator,
};

export { customQuerySelects };
