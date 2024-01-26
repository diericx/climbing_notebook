import { Prisma } from '@prisma/client';
import { exerciseEventSelects } from './exerciseEventHelper';
function makeSelect<T extends Prisma.ExerciseSelect>(
  select: Prisma.Subset<T, Prisma.ExerciseSelect>
): T {
  return select;
}

const selectEverything = makeSelect({
  id: true,
  createdByAuthUserId: true,
  type: true,
  difficulty: true,
  muscleGroup: true,
  primeMoverMuscle: true,
  secondaryMuscle: true,
  tertiaryMuscle: true,
  primaryEquipment: true,
  posture: true,
  fieldsToShow: true,
  videoUrl: true,
  name: true,
  createdAt: true,
  exerciseEvents: {
    select: {
      ...exerciseEventSelects.everything,
    },
  },
  _count: {
    select: {
      exerciseEvents: true,
    },
  },
});
const selectEverythingValidator = Prisma.validator<Prisma.ExerciseDefaultArgs>()({
  select: selectEverything,
});

const selectMinimal = makeSelect({
  id: true,
  createdByAuthUserId: true,
  name: true,
  fieldsToShow: true,
  _count: {
    select: {
      exerciseEvents: true,
    },
  },
});
const selectMinimalValidator = Prisma.validator<Prisma.ExerciseDefaultArgs>()({
  select: selectMinimal,
});

const exerciseSelects = {
  minimal: selectMinimal,
  minimalValidator: selectMinimalValidator,
  everything: selectEverything,
  everythingValidator: selectEverythingValidator,
};

export { exerciseSelects };
