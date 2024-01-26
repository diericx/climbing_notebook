import { trainingCycleSelects } from '$lib/prismaHelpers/trainingCycleHelper';
import type { Prisma, PrismaClient, TrainingCycle } from '@prisma/client';
import type { z } from 'zod';
import { APIError } from '../../errors';
import type {
  ExerciseGroupSchema,
  TrainingCycleDaySchema,
  TrainingCyclePartialSchema,
  TrainingCycleSchema,
} from '../../zodSchemas';
import type { Repo } from './repo';

export class TrainingCycleRepo implements Repo<TrainingCycle, Prisma.TrainingCycleSelect> {
  constructor(private readonly prisma: PrismaClient) {}

  canUserRead(
    userId: string | undefined,
    trainingCycle: Prisma.TrainingCycleGetPayload<{
      select: { isPublic: true; ownerId: true; privateAccessToken: true };
    }>,
    otherOptions?: {
      privateAccessToken?: string;
    }
  ) {
    // if it is public anyone can read
    if (trainingCycle.isPublic) {
      return true;
    }
    // users with private access token can read
    if (otherOptions?.privateAccessToken == trainingCycle.privateAccessToken) {
      return true;
    }
    // owner can always read
    if (userId !== undefined) {
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

  async new(data: z.infer<TrainingCycleSchema>, userId: string, trainingProgramId?: string) {
    return await this.prisma.trainingCycle.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: userId,
        trainingProgramId,
        days: {
          create: Array.from(Array(7)).map((_, i) => {
            return {
              assignedBy: userId,
              dayOfTheWeek: i,
              description: '',
            };
          }),
        },
      },
    });
  }

  // Note: everywhere we want to check permissions for an update or delete
  // we need to also check/throw on read permissions here for read...
  // does that make sense?
  // Note: make this select optional
  async getOne<S extends Prisma.TrainingCycleSelect>(options: {
    id: number;
    select: S;
    userId?: string;
    privateAccessToken?: string;
  }) {
    const { id, select, userId, privateAccessToken } = options;
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
        select: { isPublic: true; ownerId: true; privateAccessToken: true };
      }>;

    if (!this.canUserRead(userId, _trainingCycle, { privateAccessToken })) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    // Do not send privateAccessToken unless this is the owner
    if (userId != _trainingCycle.ownerId) {
      _trainingCycle.privateAccessToken = null;
    }

    return _trainingCycle;
  }

  async getManyForUser<S extends Prisma.TrainingCycleSelect>(options: {
    userId: string;
    query: 'owned' | 'saved' | 'activated';
    select: S;
    extraFilters?: { isTemplate?: boolean };
  }) {
    const { userId, query, extraFilters, select } = options;
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
    userId: string,
    data?: {
      name?: string;
      description?: string;
    }
  ) {
    const trainingCycle = await this.getOne({
      id,
      select: trainingCycleSelects.everything,
      userId,
    });

    // Create the new program
    const newCycle = await this.prisma.trainingCycle.create({
      data: {
        name: data?.name || trainingCycle.name + ' Duplicate',
        ownerId: userId,
        isPublic: false,
        description: data?.description || null,
        parentId: trainingCycle.id,
        days: {
          create: Array.from(Array(7)).map((_, i) => {
            return {
              assignedBy: userId,
              dayOfTheWeek: i,
              description: '',
              exercises: {
                create: trainingCycle.days[i].exercises.map((e) => ({
                  ...e,
                  userId: undefined,
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
                      id: userId,
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
              id: userId,
            },
          },
          exercises: {
            create: g.exercises.map((e) => ({
              ...e,
              userId: undefined,
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
                  id: userId,
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

  async update(data: z.infer<TrainingCyclePartialSchema>, id: number, userId: string) {
    const trainingCycle = await this.getOne({ id, select: {}, userId });
    if (!this.canUserUpdate(userId, trainingCycle)) {
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

  async delete(id: number, userId: string) {
    const trainingCycle = await this.getOne({
      id,
      select: {
        _count: {
          select: {
            trainingProgramScheduledSlots: true,
            activations: true,
          },
        },
      },
      userId,
    });

    if (!this.canUserDelete(userId, trainingCycle)) {
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

  async save(id: number, userId: string) {
    await this.getOne({ id, select: {}, userId });

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
                userId: userId,
              },
            },
            create: {
              userId: userId,
            },
          },
        },
      },
    });
  }

  async unsave(id: number, userId: string) {
    await this.getOne({ id, select: {}, userId });

    await this.prisma.trainingCycle.update({
      where: {
        id,
      },
      data: {
        saves: {
          delete: {
            trainingCycleId_userId: {
              trainingCycleId: id,
              userId: userId,
            },
          },
        },
      },
    });
  }

  async addExerciseGroup(exerciseGroup: z.infer<ExerciseGroupSchema>, id: number, userId: string) {
    const trainingCycle = await this.getOne({
      id,
      select: { exerciseGroups: { select: { name: true } } },
      userId,
    });
    if (!this.canUserUpdate(userId, trainingCycle)) {
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
                id: userId,
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
    userId: string
  ) {
    const trainingCycle = await this.getOne({
      id: trainingCycleId,
      select: { exerciseGroups: { select: { id: true, name: true } } },
      userId,
    });
    if (!this.canUserUpdate(userId, trainingCycle)) {
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

  async deleteExerciseGroup(id: number, userId: string, exerciseGroupId: number) {
    const trainingCycle = await this.getOne({
      id,
      select: {},
      userId,
    });
    if (!this.canUserUpdate(userId, trainingCycle)) {
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
    userId: string
  ) {
    const trainingCycle = await this.getOne({ id: trainingCycleId, select: {}, userId });
    if (!this.canUserUpdate(userId, trainingCycle)) {
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
    userId: string
  ) {
    const trainingCycle = await this.getOne({ id: trainingCycleId, select: {}, userId });
    if (!this.canUserUpdate(userId, trainingCycle)) {
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
    userId: string
  ) {
    const trainingCycle = await this.getOne({ id: trainingCycleId, select: {}, userId });
    if (!this.canUserUpdate(userId, trainingCycle)) {
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

  async activate(id: number, userId: string) {
    await this.getOne({ id, select: {}, userId });

    return await this.prisma.trainingCycle.update({
      where: {
        id,
      },
      data: {
        activations: {
          connectOrCreate: {
            where: {
              trainingCycleId_userId: {
                userId: userId,
                trainingCycleId: id,
              },
            },
            create: {
              userId: userId,
            },
          },
        },
      },
    });
  }

  async deactivate(id: number, userId: string) {
    await this.getOne({ id, select: {}, userId });

    return await this.prisma.trainingCycle.update({
      where: {
        id,
      },
      data: {
        activations: {
          delete: {
            trainingCycleId_userId: {
              userId: userId,
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
