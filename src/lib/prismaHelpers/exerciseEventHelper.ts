import { Prisma } from '@prisma/client';

export function makeSelect<T extends Prisma.ExerciseEventSelect>(
  select: Prisma.Subset<T, Prisma.ExerciseEventSelect>
): T {
  return select;
}

const selectMinimal = makeSelect({
  id: true,
  name: true,
  date: true,
  exercise: {
    select: {
      name: true,
      type: true,
    },
  },
  // This is used for the drop downs to select exercise AND to detect
  // migration status from legacy exercise
  exerciseId: true,
  ownerId: true,
  reps: true,
  sets: true,
  minutes: true,
  seconds: true,
  difficulty: true,
  weight: true,
  notes: true,
});
const selectMinimalValidator = Prisma.validator<Prisma.ExerciseEventDefaultArgs>()({
  select: selectMinimal,
});

const selectEverything = makeSelect({
  ...selectMinimal,
  createdAt: true,
  owner: true,
  markedCompletions: true,
  exerciseGroup: true,
  trainingCycleDay: true,
});
const selectEverythingValidator = Prisma.validator<Prisma.ExerciseEventDefaultArgs>()({
  select: selectEverything,
});

const exerciseEventSelects = {
  minimal: selectMinimal,
  minimalValidator: selectMinimalValidator,
  everything: selectEverything,
  everythingValidator: selectEverythingValidator,
};

export { exerciseEventSelects };
