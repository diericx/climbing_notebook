import { Prisma, type PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';
import type { ExerciseGroupSchema } from './exerciseGroup';
import type { TrainingCycleDaySchema } from './trainingCycleDay';

export const trainingCycleSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullish(),
  isPublic: z.boolean().optional().default(false),
});
export const trainingCyclePartialSchema = trainingCycleSchema.partial();
export type TrainingCycleSchema = typeof trainingCycleSchema;
export type TrainingCyclePartialSchema = typeof trainingCyclePartialSchema;

export const trainingCycleTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});
export type TrainingCycleTemplateSchema = typeof trainingCycleTemplateSchema;

export class TrainingCycleRepo {
  constructor(private readonly prisma: PrismaClient) {}

  static makeTrainingCycleSelect<T extends Prisma.TrainingCycleSelect>(
    select: Prisma.Subset<T, Prisma.TrainingCycleSelect>
  ): T {
    return select;
  }

  static selectNameOnly = this.makeTrainingCycleSelect({
    name: true,
  });

  static selectMinimal = this.makeTrainingCycleSelect({
    id: true,
    ownerId: true,
    name: true,
    description: true,
    isPublic: true,
    owner: {
      select: {
        username: true,
        profile: {
          select: {
            imageS3ObjectKey: true,
          },
        },
      },
    },
    _count: {
      select: {
        saves: true,
      },
    },
  });
  static selectMinimalValidator = Prisma.validator<Prisma.TrainingCycleDefaultArgs>()({
    select: TrainingCycleRepo.selectMinimal,
  });

  static selectEverything = this.makeTrainingCycleSelect({
    ...this.selectMinimal,
    trainingProgramId: true,
    trainingProgramScheduledSlots: true,
    privateAccessToken: true,
    trainingProgram: {
      select: {
        name: true,
      },
    },
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
  });

  async findOne<S extends Prisma.TrainingCycleSelect>(
    id: number,
    select: S
  ): Promise<Prisma.TrainingCycleGetPayload<{ select: S }>> {
    const trainingCycle = await this.prisma.trainingCycle.findUnique({
      where: {
        id,
      },
      select,
    });
    if (trainingCycle == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    return trainingCycle;
  }

  async duplicate(
    id: number,
    ownerId: string,
    data?: {
      name?: string;
      description?: string;
    }
  ) {
    const program = await this.findOne(id, TrainingCycleRepo.selectEverything);

    if (!program.isPublic && program.ownerId != ownerId) {
      throw new APIError(
        'INVALID_PERMISSIONS',
        'You can only duplicate template cycles or cycles you own'
      );
    }

    // Create the new program
    const newCycle = await this.prisma.trainingCycle.create({
      data: {
        name: data?.name || program.name + ' Duplicate',
        ownerId,
        isPublic: false,
        description: data?.description || null,
        parentId: program.id,
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
              id: newCycle.id,
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
              id: newCycle.id,
            },
            data: {
              days: {
                update: {
                  where: {
                    id: newCycle.days[i].id,
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

    await this.prisma.trainingCycle.update({
      where: {
        id: program.id,
      },
      data: {
        duplications: {
          increment: 1,
        },
      },
    });

    return newCycle;
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

  async findMany<S extends Prisma.TrainingCycleSelect>({
    where,
    select,
  }: {
    where: Prisma.TrainingCycleWhereInput;
    select: S;
  }): Promise<Prisma.TrainingCycleGetPayload<{ select: S }>[]> {
    // Fetch all
    return await this.prisma.trainingCycle.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      select,
    });
  }

  async update(data: z.infer<TrainingCyclePartialSchema>, id: number, ownerId: string) {
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
    const trainingCycle = await this.findOne(id, {
      ownerId: true,
      _count: {
        select: {
          trainingProgramScheduledSlots: true,
        },
      },
    });

    if (trainingCycle.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    if (trainingCycle._count.trainingProgramScheduledSlots != 0) {
      throw new APIError(
        'INVALID_INPUT',
        'Training Cycle cannot be deleted because it is scheduled in one or more Training Programs'
      );
    }

    return await this.prisma.trainingCycle.delete({
      where: {
        id,
      },
    });
  }

  async save(id: number, ownerId: string) {
    const trainingCycle = await this.findOne(id, { ownerId: true, isPublic: true });
    if (!trainingCycle.isPublic && trainingCycle.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to save this cycle');
    }

    await this.prisma.trainingCycle.update({
      where: {
        id,
      },
      data: {
        saves: {
          connectOrCreate: {
            where: {
              trainingCycleId_userId: {
                trainingCycleId: id,
                userId: ownerId,
              },
            },
            create: {
              userId: ownerId,
            },
          },
        },
      },
    });
  }

  async unsave(id: number, ownerId: string) {
    const trainingCycle = await this.findOne(id, { ownerId: true, isPublic: true });
    if (!trainingCycle.isPublic && trainingCycle.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to view this cycle');
    }

    await this.prisma.trainingCycle.update({
      where: {
        id,
      },
      data: {
        saves: {
          delete: {
            trainingCycleId_userId: {
              trainingCycleId: id,
              userId: ownerId,
            },
          },
        },
      },
    });
  }

  async addExerciseGroup(exerciseGroup: z.infer<ExerciseGroupSchema>, id: number, ownerId: string) {
    const trainingCycle = await this.findOne(id, {
      exerciseGroups: { select: { name: true } },
      ownerId: true,
    });
    if (trainingCycle.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS');
    }

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
    const trainingCycle = await this.findOne(trainingCycleId, {
      exerciseGroups: { select: { id: true, name: true } },
      ownerId: true,
    });
    if (trainingCycle.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    // Group names must be unique
    trainingCycle.exerciseGroups.forEach((g) => {
      if (
        g.id != exerciseGroupId &&
        exerciseGroup.name.toLocaleLowerCase() == g.name.toLocaleLowerCase()
      ) {
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
    const trainingCycle = await this.findOne(id, { ownerId: true });
    if (trainingCycle.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS');
    }

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
    const trainingCycle = await this.findOne(trainingCycleId, { ownerId: true });
    if (trainingCycle.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS');
    }

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
    const trainingCycle = await this.findOne(trainingCycleId, { ownerId: true });
    if (trainingCycle.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS');
    }

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
    const trainingCycle = await this.findOne(trainingCycleId, { ownerId: true });
    if (trainingCycle.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS');
    }

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

  async activate(id: number, ownerId: string) {
    const trainingCycle = await this.findOne(id, { ownerId: true, isPublic: true });
    if (trainingCycle.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    if (!trainingCycle.isPublic && ownerId != trainingCycle.ownerId) {
      throw new APIError(
        'INVALID_PERMISSIONS',
        'You do not have permission to activate this cycle.'
      );
    }

    return await this.prisma.trainingCycle.update({
      where: {
        id,
      },
      data: {
        activations: {
          connectOrCreate: {
            where: {
              trainingCycleId_userId: {
                userId: ownerId,
                trainingCycleId: id,
              },
            },
            create: {
              userId: ownerId,
            },
          },
        },
      },
    });
  }

  async deactivate(id: number, ownerId: string) {
    const trainingCycle = await this.findOne(id, { ownerId: true, isPublic: true });
    if (trainingCycle.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS');
    }
    if (!trainingCycle.isPublic && ownerId != trainingCycle.ownerId) {
      throw new APIError(
        'INVALID_PERMISSIONS',
        'You do not have permission to deactivate this cycle.'
      );
    }

    return await this.prisma.trainingCycle.update({
      where: {
        id,
      },
      data: {
        activations: {
          delete: {
            trainingCycleId_userId: {
              userId: ownerId,
              trainingCycleId: id,
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
