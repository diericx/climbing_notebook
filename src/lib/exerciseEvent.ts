import type { ExerciseEvent, PrismaClient } from '@prisma/client';
import { APIError } from './errors';
import { toNum } from './utils'

export class ExerciseEventFormData {
  date: Date | undefined = undefined;
  name: string | undefined = undefined;
  sets: number | undefined = undefined;
  reps: number | undefined = undefined;
  weight: number | undefined = undefined;
  seconds: number | undefined = undefined;
  minutes: number | undefined = undefined;
  difficulty: number | undefined = undefined;
  notes: string | undefined = undefined;
  isMarkedCompleted: boolean | undefined = undefined;

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { date, name, sets, reps, weight, seconds, minutes, difficulty, notes, isMarkedCompleted } = obj;
    this.date = date == undefined ? undefined : new Date(date);
    this.name = name;
    this.sets = sets == undefined ? undefined : toNum(sets, 0);
    this.reps = reps == undefined ? undefined : toNum(reps, 0);
    this.weight = weight == undefined ? undefined : toNum(weight, 0);
    this.seconds = seconds == undefined ? undefined : toNum(seconds, 0);
    this.minutes = minutes == undefined ? undefined : toNum(minutes, 0);
    this.difficulty = difficulty == undefined ? undefined : toNum(difficulty, 0);
    this.notes = notes;
    this.isMarkedCompleted = isMarkedCompleted;
  }

  validate() {
    if (this.date && isNaN(this.date.valueOf())) {
      return {
        isValid: false,
        message: 'Invalid date.'
      }
    }

    if (!this.name || this.name == '') {
      return {
        isValid: false,
        message: 'Name is required.'
      }
    }

    return {
      isValid: true,
      message: '',
    }
  }
}

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

  async new(data: ExerciseEventFormData, ownerId: string): Promise<ExerciseEvent> {
    return await this.prisma.exerciseEvent.create({
      data: {
        // TODO: Don't deconstruct?
        ...data,
        date: new Date(data.date),
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

  async update(data: ExerciseEventFormData, id: number, ownerId: string): Promise<ExerciseEvent> {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.exerciseEvent.update({
      data: {
        sets: data.sets,
        reps: data.reps,
        weight: data.weight,
        minutes: data.minutes,
        seconds: data.seconds,
        difficulty: data.difficulty,
        notes: data.notes,
        name: data.name,
        date: data.date,
        isMarkedCompleted: data.isMarkedCompleted,
        markedCompletedOn: data.isMarkedCompleted == undefined ? undefined : new Date(),
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

}
