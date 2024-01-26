import { Prisma, type Exercise, type PrismaClient } from '@prisma/client';
import type { z } from 'zod';
import { APIError } from '../../errors';
import { exerciseEventSelects } from '../../prismaHelpers/exerciseEventHelper';
import type { ExerciseSchema } from '../../zodSchemas';
import type { Repo } from './repo';

export class ExerciseRepo implements Repo<Exercise, Prisma.ExerciseSelect> {
  constructor(private readonly prisma: PrismaClient) {}

  static makeSelect<T extends Prisma.ExerciseSelect>(
    select: Prisma.Subset<T, Prisma.ExerciseSelect>
  ): T {
    return select;
  }

  static selectEverything = this.makeSelect({
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
  static selectEverythingValidator = Prisma.validator<Prisma.ExerciseDefaultArgs>()({
    select: ExerciseRepo.selectEverything,
  });

  static selectMinimal = this.makeSelect({
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
  static selectMinimalValidator = Prisma.validator<Prisma.ExerciseDefaultArgs>()({
    select: ExerciseRepo.selectMinimal,
  });

  canUserRead() {
    return true;
  }

  canUserUpdate() {
    return true;
  }

  canUserDelete(
    userId: string | undefined,
    exercise: Prisma.ExerciseGetPayload<{
      select: { createdByAuthUserId: true };
    }>
  ) {
    return exercise.createdByAuthUserId == userId;
  }

  async new(data: z.infer<ExerciseSchema>, userId: string) {
    return await this.prisma.exercise.create({
      data: {
        ...data,
        createdBy: {
          connect: {
            id: userId,
          },
        },
        createdAt: new Date(),
      },
    });
  }

  async getOne<S extends Prisma.ExerciseSelect>(options: {
    id: string;
    userId: string;
    select: S;
  }) {
    const { id, select } = options;
    const exercise = await this.prisma.exercise.findUnique({
      where: {
        id,
      },
      select: { ...select } as S,
    });
    if (exercise == null) {
      throw new APIError('NOT_FOUND');
    }

    const _exercise = exercise as Prisma.ExerciseGetPayload<{
      select: S;
    }> &
      Prisma.ExerciseGetPayload<{
        select: { createdByAuthUserId: true };
      }>;

    if (!this.canUserRead()) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return _exercise;
  }

  async getMany<S extends Prisma.ExerciseSelect>(options: { select: S }) {
    const { select } = options;
    // Fetch all
    return await this.prisma.exercise.findMany({
      orderBy: {
        exerciseEvents: {
          _count: 'desc',
        },
      },
      select,
    });
  }

  async update(data: z.infer<ExerciseSchema>, id: string) {
    return await this.prisma.exercise.update({
      data: {
        ...data,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: string, userId: string) {
    const exercise = await this.getOne({ id, userId, select: {} });
    if (exercise.createdByAuthUserId != userId) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    // Users cannot delete an exercise if any exercise events depend on it
    const dependingExerciseEvent = await this.prisma.exerciseEvent.findFirst({
      where: {
        exerciseId: id,
      },
    });
    if (dependingExerciseEvent != null) {
      throw new APIError(
        'INVALID_ACTION',
        'There are exercise events depending on this exercise and thus it cannot be removed.'
      );
    }

    return await this.prisma.exercise.delete({
      where: {
        id,
      },
    });
  }
}
