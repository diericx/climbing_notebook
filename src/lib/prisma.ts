import Prisma from '@prisma/client';
import { Prisma as _Prisma } from '@prisma/client';

const PrismaClient = Prisma.PrismaClient;
export default PrismaClient;

export const prisma = new PrismaClient();

const profileWithActiveTrainingProgram = _Prisma.validator<_Prisma.ProfileArgs>()({
  include: {
    activeTrainingProgram: {
      include: {
        days: {
          include: {
            exercises: true,
          },
        }
      }
    }
  },
})
export type ProfileWithActiveTrainingProgram = _Prisma.ProfileGetPayload<typeof profileWithActiveTrainingProgram>

const trainingProgramWithDays = _Prisma.validator<_Prisma.TrainingProgramArgs>()({
  include: {
    days: {
      include: {
        exercises: true,
        exerciseGroups: {
          include: {
            exercises: true,
          },
        }
      },
    }
  }
})
export type TrainingProgramWithDays = _Prisma.TrainingProgramGetPayload<typeof trainingProgramWithDays>

const trainingProgramComplete = _Prisma.validator<_Prisma.TrainingProgramArgs>()({
  include: {
    exerciseGroups: {
      include: {
        exercises: true,
      },
    },
    days: {
      include: {
        exercises: true,
        exerciseGroups: {
          include: {
            exercises: true,
          },
        }
      },
    }
  }
})
export type TrainingProgramComplete = _Prisma.TrainingProgramGetPayload<typeof trainingProgramComplete>

const trainingProgramDayComplete = _Prisma.validator<_Prisma.TrainingProgramDayArgs>()({
  include: {
    exercises: true,
    exerciseGroups: true,
  },
})
export type TrainingProgramDayComplete = _Prisma.TrainingProgramDayGetPayload<typeof trainingProgramDayComplete>

const exerciseGroupComplete = _Prisma.validator<_Prisma.TrainingProgramDayArgs>()({
  include: {
    exercises: true,
    exerciseGroups: true,
  },
})
export type ExerciseGroupComplete = _Prisma.ExerciseGroupGetPayload<typeof exerciseGroupComplete>
