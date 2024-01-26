import { Prisma } from '@prisma/client';
import { exerciseEventSelects } from './exerciseEventHelper';

function makeSelect<T extends Prisma.TrainingCycleSelect>(
  select: Prisma.Subset<T, Prisma.TrainingCycleSelect>
): T {
  return select;
}

const selectNameAndIdOnly = makeSelect({
  name: true,
  id: true,
});

const selectMinimal = makeSelect({
  id: true,
  ownerId: true,
  name: true,
  description: true,
  isPublic: true,
  privateAccessToken: true,
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
});
const selectMinimalValidator = Prisma.validator<Prisma.TrainingCycleDefaultArgs>()({
  select: selectMinimal,
});

const selectEverything = makeSelect({
  ...selectMinimal,
  trainingProgramId: true,
  trainingProgramScheduledSlots: true,
  privateAccessToken: true,
  trainingProgram: {
    select: {
      name: true,
    },
  },
  exerciseGroups: {
    include: {
      exercises: {
        select: {
          ...exerciseEventSelects.everything,
        },
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
        select: {
          ...exerciseEventSelects.everything,
        },
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
            select: {
              ...exerciseEventSelects.everything,
            },
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
});
const selectEverythingValidator = Prisma.validator<Prisma.TrainingCycleDefaultArgs>()({
  select: selectEverything,
});

const trainingCycleSelects = {
  nameAndId: selectNameAndIdOnly,
  minimal: selectMinimal,
  minimalValidator: selectMinimalValidator,
  everything: selectEverything,
  everythingValidator: selectEverythingValidator,
};

export { trainingCycleSelects };
