import type { Exercise, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';
import { equipment, muscleGroups, muscles, posture } from './utils'

export const exerciseSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['climbing', 'strength']),
  difficulty: z.enum(['novice', 'beginner', 'intermediate', 'advanced']),
  videoUrl: z.string().nullish(),
  muscleGroup: z.enum(muscleGroups),
  primeMoverMuscle: z.enum(muscles),
  secondaryMuscle: z.enum(muscles),
  tertiaryMuscle: z.enum(muscles),
  primaryEquipment: z.enum(equipment),
  posture: z.enum(posture),
  fieldsToShow: z.enum(['sets', 'reps', 'weight', 'minutes', 'seconds'])

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
      }
    }) as Exercise;
  }

  async get() {
    // Fetch all
    return await this.prisma.exercise.findMany({
      orderBy: {
        name: 'desc',
      },
    }) as Exercise[];
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
    const exercise = await this.getOne(id);
    if (exercise.createdByAuthUserId != userId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.')
    }

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
