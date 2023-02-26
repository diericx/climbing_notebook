import Prisma, * as PrismaAll from "@prisma/client";
import { Prisma as _Prisma } from "@prisma/client";

const PrismaClient = Prisma?.PrismaClient || PrismaAll?.PrismaClient;
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
      },
    }
  }
})
export type TrainingProgramWithDays = _Prisma.TrainingProgramGetPayload<typeof trainingProgramWithDays>

const trainingProgramDayWithExercises = _Prisma.validator<_Prisma.TrainingProgramDayArgs>()({
  include: {
    exercises: true,
  },
})
export type TrainingProgramDayWithExercises = _Prisma.TrainingProgramDayGetPayload<typeof trainingProgramDayWithExercises>
