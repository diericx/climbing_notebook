import type { ExerciseEvent, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';
import { isDateInTheSameWeekAsToday } from './utils'

export const exerciseEventSchema = z.object({
  date: z.date().default(new Date()).nullish(),
  name: z.string(),
  sets: z.number(),
  reps: z.number(),
  weight: z.number(),
  seconds: z.number(),
  minutes: z.number(),
  difficulty: z.number().default(0).nullish(),
  notes: z.string().nullish(),
  trainingProgramDayId: z.number().nullish(),
  exerciseGroupId: z.number().nullish(),
});
export type ExerciseEventSchema = typeof exerciseEventSchema;

export class ExerciseEventRepo {
  constructor(private readonly prisma: PrismaClient) { }

  async getOneAndValidateOwner(id: number, ownerId: string): Promise<ExerciseEvent> {
    const exerciseEvent = await this.prisma.exerciseEvent.findUnique({
      where: {
        id: Number(id),
      }
    });
    if (exerciseEvent == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (exerciseEvent.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.')
    }
    return exerciseEvent
  }

  async new(data: z.infer<ExerciseEventSchema>, ownerId: string): Promise<ExerciseEvent> {
    return await this.prisma.exerciseEvent.create({
      data: {
        ...data,
        ownerId,
        createdAt: new Date(),
      }
    }) as ExerciseEvent;
  }

  async get(ownerId: string, dateMin?: Date | undefined, dateMax?: Date | undefined): Promise<ExerciseEvent[]> {
    // Fetch all
    return await this.prisma.exerciseEvent.findMany({
      where: {
        ownerId: ownerId,
        trainingProgramDay: null,
        exerciseGroup: null,
        date: {
          lte: dateMax ? new Date(dateMax) : undefined,
          gte: dateMin ? new Date(dateMin) : undefined,
        },
      },
      orderBy: {
        date: 'desc',
      },
    }) as ExerciseEvent[];
  }

  async getOne(id: number, ownerId: string): Promise<ExerciseEvent> {
    return this.getOneAndValidateOwner(id, ownerId)
  }

  async update(data: z.infer<ExerciseEventSchema>, id: number, ownerId: string): Promise<ExerciseEvent> {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.exerciseEvent.update({
      data: {
        ...data
      },
      where: {
        id: Number(id),
      },
    });
  }

  async delete(id: number, ownerId: string): Promise<ExerciseEvent> {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.exerciseEvent.delete({
      where: {
        id: Number(id)
      }
    })
  }

  async setCompleted(id: number, ownerId: string, newDate: Date, isCompleted: boolean) {
    const e = await this.getOneAndValidateOwner(id, ownerId);
    const newDateStr = newDate.toISOString().split('T')[0];
    const strippedDate = new Date(newDateStr);

    // Perform a lazy trim by removing anything that is not in this week
    e.markedCompletions.filter(c => {
      return isDateInTheSameWeekAsToday(c)
    })

    // Either add or remove the given date
    if (isCompleted) {
      const alreadyExists = e.markedCompletions.find(c => c.toISOString().split('T')[0] == newDateStr);
      if (alreadyExists) {
        return e;
      }

      e.markedCompletions = [...e.markedCompletions, strippedDate]
    } else {
      e.markedCompletions = e.markedCompletions.filter(c => {
        const dstr1 = newDateStr;
        const dstr2 = c.toISOString().split('T')[0];
        return dstr1 != dstr2;
      })
    }

    return await this.prisma.exerciseEvent.update({
      data: {
        markedCompletions: e.markedCompletions
      },
      where: {
        id: Number(id),
      },
    })
  }
}
