import type { ExerciseEvent, PrismaClient } from '@prisma/client';
import { APIError } from './errors';
import { toNum } from './utils'

export class ExerciseEventFormData {
  date: Date = new Date();
  name = '';
  sets = 0;
  reps = 0;
  weight = 0;
  seconds = 0;
  minutes = 0;
  difficulty = 0;
  notes = '';

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { date, name, sets, reps, weight, seconds, minutes, difficulty, notes } = obj;
    this.date = date == undefined ? this.date : new Date(date);
    this.name = name == undefined ? this.name : name;
    this.sets = sets == undefined ? this.sets : toNum(sets, 0);
    this.reps = reps == undefined ? this.reps : toNum(reps, 0);
    this.weight = weight == undefined ? this.weight : toNum(weight, 0);
    this.seconds = seconds == undefined ? this.seconds : toNum(seconds, 0);
    this.minutes = minutes == undefined ? this.minutes : toNum(minutes, 0);
    this.difficulty = difficulty == undefined ? this.difficulty : toNum(difficulty, 0);
    this.notes = notes == undefined ? this.notes : notes;
  }

  validate() {
    if (isNaN(this.date.valueOf())) {
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
        sets: data.sets || undefined,
        reps: data.reps || undefined,
        weight: data.weight || undefined,
        minutes: data.minutes || undefined,
        seconds: data.seconds || undefined,
        difficulty: data.difficulty || undefined,
        notes: data.notes || undefined,
        name: data.name || undefined,
        date: data.date,
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
