import type { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';
import { difficulties, equipments, exerciseEventFieldsToShow, exerciseTypes, muscleGroups, muscles, postures } from './utils'

export const exerciseSchema = z.object({
  name: z.string().min(1),
  type: z.enum(exerciseTypes),
  difficulty: z.enum(difficulties).nullish(),
  videoUrl: z.string().nullish(),
  muscleGroup: z.enum(muscleGroups).nullish().default(null),
  primeMoverMuscle: z.enum(muscles).nullish().default(null),
  secondaryMuscle: z.enum(muscles).nullish().default(null),
  tertiaryMuscle: z.enum(muscles).nullish().default(null),
  primaryEquipment: z.enum(equipments).nullish().default(null),
  posture: z.enum(postures).nullish().default(null),
  fieldsToShow: z.array(z.enum(exerciseEventFieldsToShow)).refine((val) => val.length > 0, {
    message: 'At least one field is required',
  })
});
export type ExerciseSchema = typeof exerciseSchema;

export class ExerciseRepo {
  constructor(private readonly prisma: PrismaClient) { }

  async new(data: z.infer<ExerciseSchema>, creatorId: string) {
    return await this.prisma.exercise.create({
      data: {
        ...data,
        createdBy: {
          connect: {
            id: creatorId,
          }
        },
        createdAt: new Date(),
      },
    });
  }

  async get(select?: Prisma.ExerciseSelect) {
    // Fetch all
    if (select) {
      return await this.prisma.exercise.findMany({
        orderBy: {
          exerciseEvents: {
            _count: 'desc'
          }
        },
        select: select,
      });
    }
    return await this.prisma.exercise.findMany({
      orderBy: {
        exerciseEvents: {
          _count: 'desc'
        }
      },
      include: {
        _count: {
          select: {
            exerciseEvents: true,
          }
        }
      },
    });
  }

  async getOne(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: {
        id,
      }
    });
    if (exercise == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    return exercise
  }

  async update(data: z.infer<ExerciseSchema>, id: string, userId: string) {
    return await this.prisma.exercise.update({
      data: {
        ...data
      },
      where: {
        id,
      },
    });
  }

  async delete(id: string, userId: string) {
    const exercise = await this.getOne(id);
    if (exercise.createdByAuthUserId != userId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.')
    }

    const dependingExerciseEvent = await this.prisma.exerciseEvent.findFirst({
      where: {
        exerciseId: id,
      }
    })
    if (dependingExerciseEvent != null) {
      throw new APIError('INVALID_ACTION', 'There are exercise events depending on this exercise and thus it cannot be removed.')
    }

    return await this.prisma.exercise.delete({
      where: {
        id,
      }
    })
  }

}
