import type { Exercise, Prisma, PrismaClient } from '@prisma/client';
import type { z } from 'zod';
import { APIError } from '../../errors';
import type { ExerciseSchema } from '../../zodSchemas';
import type { Repo } from './repo';

export class ExerciseRepo implements Repo<Exercise, Prisma.ExerciseSelect> {
  constructor(private readonly prisma: PrismaClient) {}

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

  async searchByName<S extends Prisma.ExerciseSelect>(options: {
    select: S;
    nameQuery?: string;
    limit?: number;
  }) {
    const { nameQuery, limit } = options;

    // Run search query as raw so we can utilize trigrams
    const results = await this.prisma.$queryRaw<
      (Prisma.ExerciseGetPayload<{
        select: {
          name: true;
          id: true;
          fieldsToShow: true;
          _count: {
            select: {
              exerciseEvents: true;
            };
          };
        };
      }> & { _aggr_count_exerciseEvents: number })[]
    >`SELECT
    exercise.id as "id", exercise.name as "name", fields_to_show as "fieldsToShow", COUNT(exercise_event.exercise_id)::int AS "_aggr_count_exerciseEvents"
    FROM exercise
    LEFT JOIN exercise_event
    ON exercise_event.exercise_id = exercise.id
    GROUP BY exercise.id
    ORDER BY SIMILARITY(exercise.name,${nameQuery}) DESC 
    LIMIT ${limit} ;`;
    results.map((r) => (r._count = { exerciseEvents: r._aggr_count_exerciseEvents }));
    return results;
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
