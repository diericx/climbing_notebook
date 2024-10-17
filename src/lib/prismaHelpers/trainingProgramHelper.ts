import { Prisma } from '@prisma/client';
import { trainingCycleSelects } from './trainingCycleHelper';

function makeSelect<T extends Prisma.TrainingProgramSelect>(
  select: Prisma.Subset<T, Prisma.TrainingProgramSelect>,
): T {
  return select;
}

const selectListMinimal = makeSelect({
  id: true,
  name: true,
});
const selectListMinimalValidator = Prisma.validator<Prisma.TrainingProgramDefaultArgs>()({
  select: selectListMinimal,
});

const selectMinimal = makeSelect({
  id: true,
  name: true,
  isPublic: true,
  description: true,
  privateAccessToken: true,
  ownerId: true,
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
  _count: {
    select: {
      saves: true,
    },
  },
  saves: {
    select: {
      userId: true,
    },
  },
});
const selectMinimalValidator = Prisma.validator<Prisma.TrainingProgramDefaultArgs>()({
  select: selectMinimal,
});

const selectEverything = makeSelect({
  ...selectMinimal,
  createdAt: true,
  trainingProgramActivations: true,
  trainingProgramScheduledSlots: {
    orderBy: {
      order: 'asc',
    },
    select: {
      id: true,
      order: true,
      duration: true,
      trainingCycles: {
        select: trainingCycleSelects.everything,
      },
    },
  },
  trainingCycles: {
    select: trainingCycleSelects.everything,
  },
});
const selectEverythingValidator = Prisma.validator<Prisma.TrainingProgramDefaultArgs>()({
  select: selectEverything,
});

const trainingProgramSelects = {
  minimal: selectMinimal,
  minimalValidator: selectMinimalValidator,
  listMinimal: selectListMinimal,
  listMinimalValidator: selectListMinimalValidator,
  everything: selectEverything,
  everythingValidator: selectEverythingValidator,
};

export { trainingProgramSelects };
