import { Prisma, type ExerciseEvent, type PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';
import type { Repo } from './repo';
import { isDateInTheSameWeekAsToday } from './utils';

export const exerciseEventSchema = z.object({
  date: z.date().default(new Date()).nullish(),
  name: z.string().nullish().default(''),
  sets: z.number().default(0),
  reps: z.number().default(0),
  weight: z.number().default(0),
  seconds: z.number().default(0),
  minutes: z.number().default(0),
  difficulty: z.number().default(0).nullish(),
  notes: z.string().nullish(),
  trainingCycleDayId: z.number().nullish(),
  exerciseGroupId: z.number().nullish(),
  exerciseId: z.string().min(1, { message: 'Exercise is required' }),
});
export type ExerciseEventSchema = typeof exerciseEventSchema;

export class ExerciseEventRepo implements Repo<ExerciseEvent, Prisma.ExerciseEventSelect> {
  constructor(private readonly prisma: PrismaClient) {}
  static makeSelect<T extends Prisma.ExerciseEventSelect>(
    select: Prisma.Subset<T, Prisma.ExerciseEventSelect>
  ): T {
    return select;
  }
  static selectEverything = this.makeSelect({
    id: true,
    createdAt: true,
    date: true,
    name: true,
    sets: true,
    reps: true,
    weight: true,
    seconds: true,
    minutes: true,
    difficulty: true,
    notes: true,
    exercise: true,
    owner: true,
    markedCompletions: true,
    exerciseGroup: true,
    trainingCycleDay: true,
    exerciseId: true,
  });
  static selectEverythingValidator = Prisma.validator<Prisma.ExerciseEventDefaultArgs>()({
    select: ExerciseEventRepo.selectEverything,
  });

  static selectMinimal = this.makeSelect({
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
  });
  static selectMinimalValidator = Prisma.validator<Prisma.ExerciseEventDefaultArgs>()({
    select: ExerciseEventRepo.selectMinimal,
  });

  canUserRead(
    userId: string | undefined,
    exerciseEvent: Prisma.ExerciseEventGetPayload<{
      select: { ownerId: true };
    }>
  ) {
    return exerciseEvent.ownerId == userId;
  }

  canUserUpdate(
    userId: string | undefined,
    exerciseEvent: Prisma.ExerciseEventGetPayload<{
      select: { ownerId: true };
    }>
  ) {
    return exerciseEvent.ownerId == userId;
  }

  canUserDelete(
    userId: string | undefined,
    exerciseEvent: Prisma.ExerciseEventGetPayload<{
      select: { ownerId: true };
    }>
  ) {
    return exerciseEvent.ownerId == userId;
  }

  async new(data: z.infer<ExerciseEventSchema>, ownerId: string) {
    if (data.exerciseGroupId) {
      const exerciseGroup = await this.prisma.exerciseGroup.findUnique({
        where: {
          id: data.exerciseGroupId,
        },
      });
      if (exerciseGroup == null || exerciseGroup.ownerId != ownerId) {
        throw new APIError(
          'INVALID_PERMISSIONS',
          'You do not have permission to edit this object.'
        );
      }
    }
    if (data.trainingCycleDayId) {
      const trainingCycleDay = await this.prisma.trainingCycleDay.findUnique({
        where: {
          id: data.trainingCycleDayId,
        },
        include: {
          trainingCycle: true,
        },
      });
      if (trainingCycleDay == null || trainingCycleDay.trainingCycle.ownerId != ownerId) {
        throw new APIError(
          'INVALID_PERMISSIONS',
          'You do not have permission to edit this object.'
        );
      }
    }

    return await this.prisma.exerciseEvent.create({
      data: {
        ...data,
        ownerId,
        createdAt: new Date(),
      },
    });
  }

  async getOne<S extends Prisma.ExerciseEventSelect>(options: {
    id: number;
    userId: string;
    select: S;
  }) {
    const { id, userId, select } = options;
    const exerciseEvent = await this.prisma.exerciseEvent.findUnique({
      where: {
        id: Number(id),
      },
      select: { ...select, ownerId: true } as S,
    });
    if (exerciseEvent == null) {
      throw new APIError('NOT_FOUND');
    }

    const _exerciseEvent = exerciseEvent as Prisma.ExerciseEventGetPayload<{
      select: S;
    }> &
      Prisma.ExerciseEventGetPayload<{
        select: { ownerId: true };
      }>;
    if (!this.canUserRead(userId, _exerciseEvent)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return _exerciseEvent;
  }

  async getManyForUser<S extends Prisma.ExerciseEventSelect>(options: {
    userId: string;
    dateMin?: Date | undefined;
    dateMax?: Date | undefined;
    select: S;
  }) {
    const { userId, dateMin, dateMax, select } = options;
    // Fetch all
    return await this.prisma.exerciseEvent.findMany({
      where: {
        ownerId: userId,
        trainingCycleDay: null,
        exerciseGroup: null,
        date: {
          lte: dateMax ? new Date(dateMax) : undefined,
          gte: dateMin ? new Date(dateMin) : undefined,
        },
      },
      orderBy: {
        date: 'desc',
      },
      select: { ...select, ownerId: true } as S,
    });
  }

  async update(
    data: z.infer<ExerciseEventSchema>,
    id: number,
    userId: string,
    shouldApplyMigrationToAll = false
  ) {
    const original = await this.getOne({ id, userId, select: { exerciseId: true, name: true } });
    if (!this.canUserUpdate(userId, original)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    // Propogate this migration to all other exercises with the same name
    if (original.exerciseId == null && shouldApplyMigrationToAll) {
      await this.prisma.exerciseEvent.updateMany({
        where: {
          name: {
            equals: original.name,
          },
          ownerId: userId,
        },
        data: {
          exerciseId: data.exerciseId,
        },
      });
    }

    return await this.prisma.exerciseEvent.update({
      data: {
        ...data,
      },
      where: {
        id: Number(id),
      },
    });
  }

  async delete(id: number, userId: string) {
    const exerciseEvent = await this.getOne({ id, userId, select: {} });
    if (!this.canUserUpdate(userId, exerciseEvent)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return await this.prisma.exerciseEvent.delete({
      where: {
        id: Number(id),
      },
    });
  }

  async getOneThatNeedsExerciseMigration() {
    return this.prisma.exerciseEvent.findFirst({
      where: {
        exercise: {
          is: null,
        },
      },
    });
  }

  async setCompleted(id: number, userId: string, newDate: Date, isCompleted: boolean) {
    const e = await this.getOne({ id, userId, select: { markedCompletions: true } });
    if (!this.canUserUpdate(userId, e)) {
      throw new APIError('INVALID_PERMISSIONS');
    }
    const newDateStr = newDate.toISOString().split('T')[0];
    const strippedDate = new Date(newDateStr);

    // Perform a lazy trim by removing anything that is not in this week
    e.markedCompletions.filter((c) => {
      return isDateInTheSameWeekAsToday(c);
    });

    // Either add or remove the given date
    if (isCompleted) {
      const alreadyExists = e.markedCompletions.find(
        (c) => c.toISOString().split('T')[0] == newDateStr
      );
      if (alreadyExists) {
        return e;
      }

      e.markedCompletions = [...e.markedCompletions, strippedDate];
    } else {
      e.markedCompletions = e.markedCompletions.filter((c) => {
        const dstr1 = newDateStr;
        const dstr2 = c.toISOString().split('T')[0];
        return dstr1 != dstr2;
      });
    }

    return await this.prisma.exerciseEvent.update({
      data: {
        markedCompletions: e.markedCompletions,
      },
      where: {
        id: Number(id),
      },
    });
  }

  async getCountOfExercisesThatNeedMigration(ownerId: string) {
    return this.prisma.exerciseEvent.count({
      where: {
        exercise: {
          is: null,
        },
        ownerId,
      },
    });
  }
}
