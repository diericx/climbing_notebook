import type { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';
import type { ExerciseGroupSchema } from './exerciseGroup';
import type { TrainingCycleDaySchema } from './trainingCycleDay';

export const trainingCycleSchema = z.object({
  name: z.string().min(1),
  isPublic: z.boolean().optional().default(false),
});
export type TrainingCycleSchema = typeof trainingCycleSchema;

export class TrainingCycleRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async getOne(id: number) {
    const trainingCycle = await this.prisma.trainingCycle.findUnique({
      where: {
        id,
      },
      include: {
        owner: true,
        exerciseGroups: {
          include: {
            exercises: {
              include: {
                exercise: {
                  select: {
                    name: true,
                  },
                },
              },
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
              include: {
                exercise: {
                  select: {
                    name: true,
                  },
                },
              },
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
                  include: {
                    exercise: {
                      select: {
                        name: true,
                      },
                    },
                  },
                  orderBy: {
                    name: 'asc',
                  },
                },
              },
            },
          },
          orderBy: {
            // Note: ui depends on this being sorted in this way
            dayOfTheWeek: 'asc',
          },
        },
      },
    });
    if (trainingCycle == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    return trainingCycle;
  }

  async getOneAndValidateOwner(id: number, ownerId: string) {
    const trainingCycle = await this.getOne(id);
    if (trainingCycle.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to view this object.');
    }
    return trainingCycle;
  }

  async duplicate(id: number, ownerId: string) {
    const program = await this.getOne(id);

    // Create the new program
    const newProgram = await this.prisma.trainingCycle.create({
      data: {
        name: program.name + ' Duplicate',
        ownerId,
        days: {
          create: Array.from(Array(7)).map((_, i) => {
            return {
              assignedBy: ownerId,
              dayOfTheWeek: i,
              description: '',
              exercises: {
                create: program.days[i].exercises.map((e) => ({
                  ...e,
                  ownerId: undefined,
                  exerciseGroupId: undefined,
                  trainingCycleDayId: undefined,
                  exerciseId: undefined,
                  id: undefined,
                  exercise:
                    e.exerciseId === null
                      ? undefined
                      : {
                          connect: {
                            id: e.exerciseId,
                          },
                        },
                  owner: {
                    connect: {
                      id: ownerId,
                    },
                  },
                })),
              },
            };
          }),
        },
      },
      include: {
        days: {
          orderBy: {
            // Note: ui depends on this being sorted in this way
            dayOfTheWeek: 'asc',
          },
        },
      },
    });

    // Create each group individually by looping through the groups of the old program so
    // we can properly setup the connections to each day.
    for (const g of program.exerciseGroups) {
      const newGroup = await this.prisma.exerciseGroup.create({
        data: {
          ...g,
          id: undefined,
          trainingCycleId: undefined,
          trainingCycle: {
            connect: {
              id: newProgram.id,
            },
          },
          ownerId: undefined,
          owner: {
            connect: {
              id: ownerId,
            },
          },
          exercises: {
            create: g.exercises.map((e) => ({
              ...e,
              ownerId: undefined,
              exerciseGroupId: undefined,
              trainingCycleDayId: undefined,
              exerciseId: undefined,
              id: undefined,
              exercise:
                e.exerciseId === null
                  ? undefined
                  : {
                      connect: {
                        id: e.exerciseId,
                      },
                    },
              owner: {
                connect: {
                  id: ownerId,
                },
              },
            })),
          },
        },
      });

      // Find each day where the old group was connected by index and connect it
      // to the same day in the new program.
      for (const i in program.days) {
        const day = program.days[i];
        if (day.exerciseGroups.find((_g) => _g.id == g.id) != undefined) {
          await this.prisma.trainingCycle.update({
            where: {
              id: newProgram.id,
            },
            data: {
              days: {
                update: {
                  where: {
                    id: newProgram.days[i].id,
                  },
                  data: {
                    exerciseGroups: {
                      connect: [{ id: newGroup.id }],
                    },
                  },
                },
              },
            },
          });
        }
      }
    }
  }

  async new(data: z.infer<TrainingCycleSchema>, ownerId: string, trainingProgramId?: string) {
    return await this.prisma.trainingCycle.create({
      data: {
        name: data.name,
        ownerId,
        trainingProgramId,
        days: {
          create: Array.from(Array(7)).map((_, i) => {
            return {
              assignedBy: ownerId,
              dayOfTheWeek: i,
              description: '',
            };
          }),
        },
      },
    });
  }

  async get(ownerId: string, where?: Prisma.TrainingCycleWhereInput) {
    // Fetch all
    return await this.prisma.trainingCycle.findMany({
      where: {
        ownerId,
        ...where,
      },
      orderBy: {
        createdAt: 'desc',
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
                  },
                },
              },
            },
          },
          orderBy: {
            // Note: ui depends on this being sorted in this way
            dayOfTheWeek: 'asc',
          },
        },
      },
    });
  }

  async update(data: z.infer<TrainingCycleSchema>, id: number, ownerId: string) {
    // Get current training program
    const trainingCycle = await this.prisma.trainingCycle.findUnique({
      where: {
        id,
      },
      include: {
        days: true,
      },
    });
    if (trainingCycle == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (trainingCycle.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
    }

    // Update training program
    return this.prisma.trainingCycle.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async delete(id: number, ownerId: string) {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.trainingCycle.delete({
      where: {
        id,
      },
    });
  }

  async addExerciseGroup(exerciseGroup: z.infer<ExerciseGroupSchema>, id: number, ownerId: string) {
    const trainingCycle = await this.getOneAndValidateOwner(id, ownerId);

    // Group names must be unique
    trainingCycle.exerciseGroups.forEach((g) => {
      if (exerciseGroup.name.toLocaleLowerCase() == g.name.toLocaleLowerCase()) {
        throw new APIError('INVALID_INPUT', 'Group with that name already exists.');
      }
    });

    return await this.prisma.trainingCycle.update({
      where: {
        id,
      },
      data: {
        exerciseGroups: {
          create: {
            ...exerciseGroup,
            name: exerciseGroup.name,
            owner: {
              connect: {
                id: ownerId,
              },
            },
          },
        },
      },
    });
  }

  async editExerciseGroup(
    exerciseGroup: z.infer<ExerciseGroupSchema>,
    trainingCycleId: number,
    exerciseGroupId: number,
    ownerId: string
  ) {
    const trainingCycle = await this.getOneAndValidateOwner(exerciseGroup.id, ownerId);

    // Group names must be unique
    trainingCycle.exerciseGroups.forEach((g) => {
      if (exerciseGroup.name.toLocaleLowerCase() == g.name.toLocaleLowerCase()) {
        throw new APIError('INVALID_INPUT', 'Group with that name already exists.');
      }
    });

    return await this.prisma.trainingCycle.update({
      where: {
        id: trainingCycleId,
      },
      data: {
        exerciseGroups: {
          update: {
            where: {
              id: exerciseGroupId,
            },
            data: {
              ...exerciseGroup,
            },
          },
        },
      },
    });
  }

  async deleteExerciseGroup(id: number, ownerId: string, exerciseGroupId: number) {
    await this.getOneAndValidateOwner(id, ownerId);
    return await this.prisma.trainingCycle.update({
      where: {
        id,
      },
      data: {
        exerciseGroups: {
          delete: {
            id: exerciseGroupId,
          },
        },
      },
    });
  }

  async connectExerciseGroupToDay(
    trainingCycleId: number,
    groupId: number,
    trainingCycleDayId: number,
    ownerId: string
  ) {
    await this.getOneAndValidateOwner(trainingCycleId, ownerId);
    return await this.prisma.trainingCycle.update({
      where: {
        id: trainingCycleId,
      },
      data: {
        days: {
          update: {
            where: {
              id: trainingCycleDayId,
            },
            data: {
              exerciseGroups: {
                connect: [{ id: groupId }],
              },
            },
          },
        },
      },
    });
  }

  async disconnectExerciseGroupFromDay(
    trainingCycleId: number,
    groupId: number,
    trainingCycleDayId: number,
    ownerId: string
  ) {
    await this.getOneAndValidateOwner(trainingCycleId, ownerId);
    return await this.prisma.trainingCycle.update({
      where: {
        id: trainingCycleId,
      },
      data: {
        days: {
          update: {
            where: {
              id: trainingCycleDayId,
            },
            data: {
              exerciseGroups: {
                disconnect: [{ id: groupId }],
              },
            },
          },
        },
      },
    });
  }

  async editTrainingCycleDay(
    data: z.infer<TrainingCycleDaySchema>,
    trainingCycleId: number,
    trainingCycleDayId: number,
    ownerId: string
  ) {
    await this.getOneAndValidateOwner(trainingCycleId, ownerId);
    return await this.prisma.trainingCycle.update({
      where: {
        id: trainingCycleId,
      },
      data: {
        days: {
          update: {
            where: {
              id: trainingCycleDayId,
            },
            data: {
              ...data,
            },
          },
        },
      },
    });
  }
}

export function doesTrainingCycleHaveLegacyExercises(
  p: Prisma.TrainingCycleGetPayload<{
    include: {
      days: {
        include: {
          exercises: true;
          exerciseGroups: {
            include: {
              exercises: true;
            };
          };
        };
      };
    };
  }>
) {
  for (const d of p.days) {
    if (
      d.exercises.find((e) => e.exerciseId == null) ||
      d.exerciseGroups.find((g) => g.exercises.find((e) => e.exerciseId == null))
    ) {
      return true;
    }
  }
  return false;
}
