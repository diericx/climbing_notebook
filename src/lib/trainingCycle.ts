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

  canUserRead(
    userId: string | undefined,
    trainingCycle: Prisma.TrainingCycleGetPayload<{
      select: { isPublic: true; ownerId: true };
    }>
  ) {
    if (userId === undefined) {
      if (trainingCycle.isPublic) {
        return true;
      }
    } else {
      if (trainingCycle.ownerId == userId) {
        return true;
      }
    }
    return false;
  }

  canUserUpdate(
    userId: string,
    trainingCycle: Prisma.TrainingCycleGetPayload<{
      select: { ownerId: true };
    }>
  ) {
    return trainingCycle.ownerId == userId;
  }

  canUserDelete(
    userId: string,
    trainingCycle: Prisma.TrainingCycleGetPayload<{
      select: { ownerId: true };
    }>
  ) {
    return trainingCycle.ownerId == userId;
  }

  // Note: everywhere we want to check permissions for an update or delete
  // we need to also check/throw on read permissions here for read...
  // does that make sense?
  // Note: make this select optional
  async getOne<S extends Prisma.TrainingCycleSelect>(
    id: number,
    select: S,
    ownerId: string | undefined
  ) {
    const trainingCycle = await this.prisma.trainingCycle.findUnique({
      where: {
        id,
      },
      select: { ...select, isPublic: true, ownerId: true } as S,
    });
    if (trainingCycle == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }

    const _trainingCycle = trainingCycle as Prisma.TrainingCycleGetPayload<{
      select: S;
    }> &
      Prisma.TrainingCycleGetPayload<{
        select: { isPublic: true; ownerId: true };
      }>;

    if (!this.canUserRead(ownerId, _trainingCycle)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return _trainingCycle;
  }

  async getManyForUser<S extends Prisma.TrainingCycleSelect>(
    userId: string,
    options: {
      query: 'owned' | 'saved' | 'activated';
      select: S;
      extraFilters?: { isTemplate?: boolean };
    }
  ): Promise<Prisma.TrainingCycleGetPayload<{ select: S }>[]> {
    const { query, extraFilters, select } = options;
    let where: Prisma.TrainingCycleWhereInput = {};
    if (query == 'owned') {
      where = {
        ownerId: userId,
      };
    } else if (query == 'saved') {
      where = {
        saves: {
          some: {
            userId,
          },
        },
      };
    } else if (query == 'activated') {
      where = {
        activations: {
          some: {
            userId: userId,
          },
        },
      };
    }
    if (extraFilters != undefined) {
      if (extraFilters.isTemplate != undefined) {
        if (extraFilters.isTemplate === true)
          where = {
            ...where,
            trainingProgramId: null,
          };
        else
          where = {
            ...where,
            trainingProgramId: { not: null },
          };
      }
    }
    // Fetch all
    return await this.prisma.trainingCycle.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      select,
    });
  }

  async getAllPublic<S extends Prisma.TrainingCycleSelect>(
    select: S
  ): Promise<Prisma.TrainingCycleGetPayload<{ select: S }>[]> {
    // Fetch all
    return await this.prisma.trainingCycle.findMany({
      where: {
        isPublic: true,
      },
      orderBy: {
        name: 'asc',
      },
      select,
    });
  }

  async duplicate(
    id: number,
    ownerId: string,
    data?: {
      name?: string;
      description?: string;
    }
  ) {
    const trainingCycle = await this.getOne(id, TrainingCycleRepo.selectEverything, ownerId);

    // Create the new program
    const newCycle = await this.prisma.trainingCycle.create({
      data: {
        name: data?.name || trainingCycle.name + ' Duplicate',
        ownerId,
        isPublic: false,
        description: data?.description || null,
        parentId: trainingCycle.id,
        days: {
          create: Array.from(Array(7)).map((_, i) => {
            return {
              assignedBy: ownerId,
              dayOfTheWeek: i,
              description: '',
              exercises: {
                create: trainingCycle.days[i].exercises.map((e) => ({
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
    for (const g of trainingCycle.exerciseGroups) {
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
      for (const i in trainingCycle.days) {
        const day = trainingCycle.days[i];
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
        id: trainingCycle.id,
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

  async update(data: z.infer<TrainingCyclePartialSchema>, id: number, ownerId: string) {
    const trainingCycle = await this.getOne(id, {}, ownerId);
    if (!this.canUserUpdate(ownerId, trainingCycle)) {
      throw new APIError('INVALID_PERMISSIONS');
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
    const trainingCycle = await this.getOne(
      id,
      {
        _count: {
          select: {
            trainingProgramScheduledSlots: true,
          },
        },
      },
      ownerId
    );

    if (!this.canUserDelete(ownerId, trainingCycle)) {
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
    await this.getOne(id, {}, ownerId);

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
    await this.getOne(id, {}, ownerId);

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
    const trainingCycle = await this.getOne(
      id,
      { exerciseGroups: { select: { name: true } } },
      ownerId
    );
    if (!this.canUserUpdate(ownerId, trainingCycle)) {
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
    const trainingCycle = await this.getOne(
      trainingCycleId,
      { exerciseGroups: { select: { id: true, name: true } } },
      ownerId
    );
    if (!this.canUserUpdate(ownerId, trainingCycle)) {
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
    const trainingCycle = await this.getOne(id, {}, ownerId);
    if (!this.canUserUpdate(ownerId, trainingCycle)) {
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
    const trainingCycle = await this.getOne(trainingCycleId, {}, ownerId);
    if (!this.canUserUpdate(ownerId, trainingCycle)) {
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
    const trainingCycle = await this.getOne(trainingCycleId, {}, ownerId);
    if (!this.canUserUpdate(ownerId, trainingCycle)) {
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
    const trainingCycle = await this.getOne(trainingCycleId, {}, ownerId);
    if (!this.canUserUpdate(ownerId, trainingCycle)) {
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
    await this.getOne(id, { ownerId: true, isPublic: true }, ownerId);

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
    await this.getOne(id, { ownerId: true, isPublic: true }, ownerId);

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
