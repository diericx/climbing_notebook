import type { PrismaClient, TrainingProgram } from '@prisma/client';
import { APIError } from './errors';
import type { ExerciseGroupComplete, TrainingProgramComplete, TrainingProgramDayComplete } from './prisma';

export class TrainingProgramFormData {
  name = '';
  days: TrainingProgramDayComplete[] = [];
  exerciseGroups: ExerciseGroupComplete[] = [];

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { name, days, exerciseGroups } = obj;
    this.name = name == undefined ? this.name : name;
    this.days = days == undefined ? this.days : days as TrainingProgramDayComplete[];
    this.exerciseGroups = exerciseGroups == undefined ? this.exerciseGroups : exerciseGroups as ExerciseGroupComplete[];
  }

  validate() {
    if (this.name == '') {
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

export class TrainingProgramRepo {
  constructor(private readonly prisma: PrismaClient) { }

  async getOneAndValidateOwner(id: number, ownerId: number): Promise<TrainingProgramComplete> {
    const trainingProgram = await this.prisma.trainingProgram.findUnique({
      where: {
        id,
      },
      include: {
        exerciseGroups: {
          include: {
            exercises: {
              orderBy: {
                name: 'asc',
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
        days: {
          include: {
            exercises: {
              orderBy: {
                name: 'asc',
              },
            },
            exerciseGroups: {
              orderBy: {
                name: 'asc',
              },
              include: {
                exercises: {
                  orderBy: {
                    name: 'asc',
                  }
                }
              }
            },
          },
          orderBy: {
            // Note: ui depends on this being sorted in this way
            dayOfTheWeek: 'asc',
          },
        }
      }
    });
    if (trainingProgram == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (trainingProgram.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.')
    }
    return trainingProgram
  }

  async new(data: TrainingProgramFormData, ownerId: number): Promise<TrainingProgram> {
    return await this.prisma.trainingProgram.create({
      data: {
        name: data.name,
        ownerId,
        days: {
          create: Array.from(Array(7)).map((_, i) => {
            return {
              assignedBy: ownerId,
              dayOfTheWeek: i,
              description: '',
            }
          })
        }
      }
    }) as TrainingProgram;
  }

  async get(ownerId: number): Promise<TrainingProgram[]> {
    // Fetch all
    return await this.prisma.trainingProgram.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }) as TrainingProgram[];
  }

  async getOne(id: number, ownerId: number): Promise<TrainingProgramComplete> {
    return this.getOneAndValidateOwner(id, ownerId)
  }

  async update(data: TrainingProgramFormData, id: number, ownerId: number): Promise<TrainingProgram> {
    // Get current training program
    const trainingProgram = await this.prisma.trainingProgram.findUnique({
      where: {
        id,
      },
      include: {
        days: true,
      }
    });
    if (trainingProgram == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (trainingProgram.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.')
    }


    // Note: everything below is done transactionally as it is mutating all the data.
    // if something fails we want to maintain previous state.

    // Delete all the exercises on each day
    const deleteAllExercisesOnEachDay = trainingProgram.days.map(day =>
      this.prisma.exerciseEvent.deleteMany({
        where: {
          trainingProgramDayId: Number(day.id),
          ownerId,
        },
      })
    )

    // Delete all the exercise groups and their exercises (via cascade)
    const deleteAllExerciseGroupsAndTheirExercises = this.prisma.exerciseGroup.deleteMany({
      where: {
        trainingProgramId: Number(id),
        ownerId,
      },
    });

    // Update training program
    const updateTrainingProgram = this.prisma.trainingProgram.updateMany({
      where: {
        id,
        ownerId,
      },
      data: {
        name: data.name,
      },
    });

    // Update days
    const updateDays = data.days.map(d =>
      this.prisma.trainingProgramDay.update({
        where: {
          id: d.id,
        },
        data: {
          description: d.description,
        }
      })
    )

    // Create groups with their exercises
    const createGroupsAndTheirExercises = data.exerciseGroups.map(g => {
      const trainingProgramDayIds: number[] = []
      data.days.map(d => {
        if (d.exerciseGroups.find(_g => _g.id == g.id)) {
          trainingProgramDayIds.push(d.id)
        }
      })

      return this.prisma.exerciseGroup.create({
        data: {
          trainingProgramId: Number(g.trainingProgramId),
          ownerId: ownerId,
          name: g.name,
          exercises: {
            create: g.exercises.map(e => ({
              name: e.name,
              sets: Number(e.sets),
              reps: Number(e.reps),
              minutes: Number(e.minutes),
              seconds: Number(e.seconds),
              weight: Number(e.weight),
              ownerId,
              notes: e.notes,
            }))
          },
          trainingProgramDays: {
            connect: trainingProgramDayIds.map(_id => ({
              id: _id,
            }))
          }
        }
      })

    })

    // Create exercises for each day
    const createExercisesForEachDay = this.prisma.exerciseEvent.createMany({
      data: data.days.map(d => d.exercises.map(e => ({
        name: e.name,
        sets: Number(e.sets),
        reps: Number(e.reps),
        minutes: Number(e.minutes),
        seconds: Number(e.seconds),
        weight: Number(e.weight),
        ownerId,
        trainingProgramDayId: Number(d.id),
        notes: e.notes,
      }))).flat(1)
    })

    await this.prisma.$transaction([
      ...deleteAllExercisesOnEachDay,
      deleteAllExerciseGroupsAndTheirExercises,
      updateTrainingProgram,
      ...updateDays,
      ...createGroupsAndTheirExercises,
      createExercisesForEachDay,
    ])

    return this.getOne(id, ownerId);
  }

  async delete(id: number, ownerId: number): Promise<TrainingProgram> {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.trainingProgram.delete({
      where: {
        id
      }
    })
  }
}
