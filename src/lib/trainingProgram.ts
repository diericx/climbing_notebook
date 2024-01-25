import { Prisma, type PrismaClient, type TrainingProgram } from '@prisma/client';
import cuid from 'cuid';
import type { z } from 'zod';
import { APIError } from './errors';
import type { Repo } from './repo';
import { TrainingCycleRepo } from './trainingCycle';
import type {
  TrainingProgramActivationSchema,
  TrainingProgramPartialSchema,
  TrainingProgramScheduledSlotSchema,
  TrainingProgramSchema,
} from './zodSchemas';

export class TrainingProgramRepo implements Repo<TrainingProgram, Prisma.TrainingProgramSelect> {
  constructor(private readonly prisma: PrismaClient) {}

  static makeSelect<T extends Prisma.TrainingProgramSelect>(
    select: Prisma.Subset<T, Prisma.TrainingProgramSelect>
  ): T {
    return select;
  }

  static selectMinimal = this.makeSelect({
    id: true,
    name: true,
    isPublic: true,
    description: true,
    privateAccessToken: true,
    ownerId: true,
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
    saves: {
      select: {
        userId: true,
      },
    },
  });
  static selectMinimalValidator = Prisma.validator<Prisma.TrainingProgramDefaultArgs>()({
    select: TrainingProgramRepo.selectMinimal,
  });

  static selectEverything = this.makeSelect({
    ...this.selectMinimal,
    createdAt: true,
    trainingProgramActivations: true,
    trainingProgramScheduledSlots: {
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        order: true,
        duration: true,
        trainingCycles: {
          select: TrainingCycleRepo.selectEverything,
        },
      },
    },
    trainingCycles: {
      select: TrainingCycleRepo.selectEverything,
    },
  });
  static selectEverythingValidator = Prisma.validator<Prisma.TrainingProgramDefaultArgs>()({
    select: TrainingProgramRepo.selectEverything,
  });

  canUserRead(
    userId: string | undefined,
    trainingProgram: Prisma.TrainingProgramGetPayload<{
      select: { ownerId: true; privateAccessToken: true; isPublic: true };
    }>,
    otherOptions?: {
      privateAccessToken?: string;
    }
  ) {
    // if it is public anyone can read
    if (trainingProgram.isPublic) {
      return true;
    }
    // users with private access token can read
    if (otherOptions?.privateAccessToken == trainingProgram.privateAccessToken) {
      return true;
    }
    // owner can always read
    if (userId !== undefined) {
      if (trainingProgram.ownerId == userId) {
        return true;
      }
    }
    return false;
  }

  canUserUpdate(
    userId: string | undefined,
    trainingProgram: Prisma.TrainingProgramGetPayload<{
      select: { ownerId: true };
    }>
  ) {
    return trainingProgram.ownerId == userId;
  }

  canUserDelete(
    userId: string | undefined,
    trainingProgram: Prisma.TrainingProgramGetPayload<{
      select: { ownerId: true };
    }>
  ) {
    return trainingProgram.ownerId == userId;
  }

  async new(data: z.infer<TrainingProgramSchema>, ownerId: string) {
    return await this.prisma.trainingProgram.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId,
      },
    });
  }

  async getOne<S extends Prisma.TrainingProgramSelect>(options: {
    id: string;
    select: S;
    userId?: string;
    privateAccessToken?: string;
  }) {
    const { id, userId, select, privateAccessToken } = options;
    const trainingProgram = await this.prisma.trainingProgram.findUnique({
      where: {
        id,
      },
      select: { ...select, ownerId: true, isPublic: true, privateAccessToken: true } as S,
    });
    if (trainingProgram == null) {
      throw new APIError('NOT_FOUND');
    }

    const _trainingProgram = trainingProgram as Prisma.TrainingProgramGetPayload<{
      select: S;
    }> &
      Prisma.TrainingProgramGetPayload<{
        select: { ownerId: true; privateAccessToken: true; isPublic: true };
      }>;
    if (!this.canUserRead(userId, _trainingProgram, { privateAccessToken })) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    // Do not send privateAccessToken unless this is the owner
    if (userId != _trainingProgram.ownerId) {
      _trainingProgram.privateAccessToken = null;
    }

    return _trainingProgram;
  }

  // Wrapper function to make code more readable. Get one does all the same logic required
  // to simply check if a user has read access to a resource which is a common requirement.
  async validateReadAccess(id: string, userId: string) {
    return this.getOne({ id, userId, select: {} });
  }

  async getManyForUser<S extends Prisma.TrainingProgramSelect>(options: {
    userId: string;
    select: S;
    // TODO: Delete this where input?
    where?: Prisma.TrainingProgramWhereInput;
  }) {
    const { userId, select, where } = options;
    // Fetch all
    return await this.prisma.trainingProgram.findMany({
      where: {
        ownerId: userId,
        ...where,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: { ...select, ownerId: true } as S,
    });
  }

  async getManySavedForUser<S extends Prisma.TrainingProgramSelect>(options: {
    userId: string;
    select: S;
  }) {
    const { userId, select } = options;
    // Fetch all
    return await this.prisma.trainingProgram.findMany({
      where: {
        ownerId: userId,
        saves: {
          some: {
            // Default to empty string so query defaults to returning empty array
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: { ...select, ownerId: true } as S,
    });
  }

  async getManyPublic<S extends Prisma.TrainingProgramSelect>(options: { select: S }) {
    const { select } = options;
    // Fetch all
    return await this.prisma.trainingProgram.findMany({
      where: {
        isPublic: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: { ...select, ownerId: true } as S,
    });
  }

  async update(data: z.infer<TrainingProgramPartialSchema>, id: string, userId: string) {
    const trainingProgram = await this.getOne({
      id,
      userId,
      select: {},
    });
    if (!this.canUserUpdate(userId, trainingProgram)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    // Update training program
    return this.prisma.trainingProgram.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async duplicate(id: string, userId: string, data?: { name?: string }) {
    const trainingProgram = await this.getOne({
      id,
      userId,
      select: {
        trainingCycles: true,
        name: true,
        id: true,
        trainingProgramScheduledSlots: {
          include: {
            trainingCycles: {
              include: {
                owner: true,
              },
            },
          },
        },
      },
    });

    // Note: id must be manually generated here so we can use it in the nested connect
    // below
    const newTrainingProgramId = cuid();
    const updatedProgram = await this.prisma.trainingProgram.create({
      data: {
        ...trainingProgram,
        ...data,
        id: newTrainingProgramId,
        name: data?.name || trainingProgram.name + ' Duplicate',
        parentId: trainingProgram.id,
        ownerId: userId,
        // Dupes always start private
        isPublic: false,
        trainingCycles: {
          create: trainingProgram.trainingCycles.map((c) => ({
            ...c,
            ownerId: userId,
            id: undefined,
            trainingProgramId: undefined,
          })),
        },
        trainingProgramScheduledSlots: {
          create: trainingProgram.trainingProgramScheduledSlots.map((s) => {
            if (s.trainingCycles[0].trainingProgramId) {
              return {
                ...s,
                id: undefined,
                trainingProgramId: undefined,
                trainingCycles: {
                  connect: {
                    trainingProgramId_name: {
                      name: s.trainingCycles[0].name,
                      trainingProgramId: newTrainingProgramId,
                    },
                  },
                },
              };
            } else {
              return {
                ...s,
                id: undefined,
                trainingProgramId: undefined,
                trainingCycles: {
                  connect: {
                    id: s.trainingCycles[0].id,
                  },
                },
              };
            }
          }),
        },
      },
    });

    await this.prisma.trainingProgram.update({
      where: {
        id,
      },
      data: {
        duplications: {
          increment: 1,
        },
      },
    });

    return updatedProgram;
  }

  async save(id: string, userId: string) {
    this.validateReadAccess(id, userId);

    await this.prisma.trainingProgram.update({
      where: {
        id,
      },
      data: {
        saves: {
          connectOrCreate: {
            where: {
              trainingProgramId_userId: {
                trainingProgramId: id,
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

  async unsave(id: string, userId: string) {
    this.validateReadAccess(id, userId);

    await this.prisma.trainingProgram.update({
      where: {
        id,
      },
      data: {
        saves: {
          delete: {
            trainingProgramId_userId: {
              trainingProgramId: id,
              userId,
            },
          },
        },
      },
    });
  }

  async addTrainingProgramScheduledSlot(
    data: z.infer<TrainingProgramScheduledSlotSchema>,
    id: string,
    userId: string
  ) {
    const trainingProgram = await this.getOne({
      id,
      userId,
      select: { trainingProgramScheduledSlots: true },
    });
    if (!this.canUserUpdate(userId, trainingProgram)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    // Cannot add a slot with an order less than 0 or beyond the current size.
    // e.g. when length is 0, order must be 0. When length is 3, max is 3 (placing it
    // at the end)
    if (data.order > trainingProgram.trainingProgramScheduledSlots.length || data.order < 0) {
      throw new APIError('INVALID_INPUT', 'Invalid order');
    }

    // Move all the slots that come after this slot forward
    const incrementOrderOfSubsequentSlots = trainingProgram.trainingProgramScheduledSlots
      .filter((s) => s.order >= data.order)
      .map((s) =>
        this.prisma.trainingProgramScheduledSlot.update({
          where: {
            id: s.id,
          },
          data: {
            order: s.order + 1,
          },
        })
      );

    // Update training program
    const { trainingCycleId, ...rest } = data;
    const createNewSlot = this.prisma.trainingProgram.update({
      where: {
        id,
      },
      data: {
        trainingProgramScheduledSlots: {
          create: {
            ...rest,
            trainingCycles: {
              connect: {
                id: trainingCycleId,
              },
            },
          },
        },
      },
    });

    return await this.prisma.$transaction([...incrementOrderOfSubsequentSlots, createNewSlot]);
  }

  async deleteTrainingProgramScheduledSlot(
    trainingProgramId: string,
    trainingProgramScheduledSlotId: string,
    userId: string
  ) {
    const trainingProgram = await this.getOne({
      id: trainingProgramId,
      userId,
      select: { trainingProgramScheduledSlots: true },
    });
    if (!this.canUserUpdate(userId, trainingProgram)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    const trainingProgramScheduledSlot = await this.prisma.trainingProgramScheduledSlot.findUnique({
      where: {
        id: trainingProgramScheduledSlotId,
      },
    });
    if (trainingProgramScheduledSlot == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }

    // Move all the slots that come after this slot down
    const decrementOrderOfSubsequentSlots = trainingProgram.trainingProgramScheduledSlots
      .filter((s) => s.order >= trainingProgramScheduledSlot.order)
      .map((s) =>
        this.prisma.trainingProgramScheduledSlot.update({
          where: {
            id: s.id,
          },
          data: {
            order: s.order - 1,
          },
        })
      );

    const deleteSlot = this.prisma.trainingProgram.update({
      data: {
        trainingProgramScheduledSlots: {
          delete: {
            id: trainingProgramScheduledSlotId,
          },
        },
      },
      where: {
        id: trainingProgramId,
      },
    });

    return await this.prisma.$transaction([...decrementOrderOfSubsequentSlots, deleteSlot]);
  }

  async updateTrainingProgramScheduledSlot(
    data: z.infer<TrainingProgramScheduledSlotSchema>,
    trainingProgramId: string,
    slotId: string,
    userId: string
  ) {
    const trainingProgram = await this.getOne({
      id: trainingProgramId,
      userId,
      select: { trainingProgramScheduledSlots: true },
    });
    if (!this.canUserUpdate(userId, trainingProgram)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    const trainingProgramScheduledSlot = await this.prisma.trainingProgramScheduledSlot.findUnique({
      where: {
        id: slotId,
      },
      include: {
        trainingCycles: true,
      },
    });
    if (trainingProgramScheduledSlot == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }

    // NOTE: cannot update order with this function
    const { trainingCycleId, ...rest } = data;
    const slot = await this.prisma.trainingProgramScheduledSlot.update({
      data: {
        ...rest,
        order: undefined,
        trainingCycles: {
          disconnect: {
            id: trainingProgramScheduledSlot.trainingCycles[0]?.id,
          },
          connect: {
            id: trainingCycleId,
          },
        },
      },
      where: {
        id: slotId,
      },
    });

    return slot;
  }

  async moveTrainingProgramScheduledSlot(
    trainingProgramId: string,
    trainingProgramScheduledSlotId: string,
    order: number,
    userId: string
  ) {
    const trainingProgram = await this.getOne({
      id: trainingProgramId,
      userId,
      select: { trainingProgramScheduledSlots: true },
    });
    if (!this.canUserUpdate(userId, trainingProgram)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    const trainingProgramScheduledSlot = await this.prisma.trainingProgramScheduledSlot.findUnique({
      where: {
        id: trainingProgramScheduledSlotId,
      },
    });
    if (trainingProgramScheduledSlot == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }

    // Cannot add a slot with an order less than 0 or beyond the current size.
    // e.g. when length is 0, order must be 0. When length is 3, max is 3 (placing it
    // at the end)
    if (order > trainingProgram.trainingProgramScheduledSlots.length || order < 0) {
      throw new APIError('INVALID_INPUT', 'Invalid order');
    }

    // Move all the slots that come after this slot down
    const decrementOrderOfSubsequentSlots = trainingProgram.trainingProgramScheduledSlots
      .filter((s) => s.order > trainingProgramScheduledSlot.order && s.order <= order)
      .map((s) =>
        this.prisma.trainingProgramScheduledSlot.update({
          where: {
            id: s.id,
          },
          data: {
            order: s.order - 1,
          },
        })
      );

    // Move all the slots that come before this slot forward
    const incrementOrderOfSubsequentSlots = trainingProgram.trainingProgramScheduledSlots
      .filter((s) => s.order < trainingProgramScheduledSlot.order && s.order >= order)
      .map((s) =>
        this.prisma.trainingProgramScheduledSlot.update({
          where: {
            id: s.id,
          },
          data: {
            order: s.order + 1,
          },
        })
      );

    const moveSlot = this.prisma.trainingProgramScheduledSlot.update({
      data: {
        order,
      },
      where: {
        id: trainingProgramScheduledSlot.id,
      },
    });

    return await this.prisma.$transaction([
      ...decrementOrderOfSubsequentSlots,
      ...incrementOrderOfSubsequentSlots,
      moveSlot,
    ]);
  }

  async getActivations(ownerId: string) {
    return this.prisma.trainingProgramActivation.findMany({
      where: {
        ownerId,
      },
      include: {
        trainingProgram: {
          select: {
            name: true,
            trainingProgramScheduledSlots: {
              select: {
                duration: true,
                trainingCycles: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async newActivation(data: z.infer<TrainingProgramActivationSchema>, userId: string) {
    this.validateReadAccess(data.trainingProgramId, userId);

    return await this.prisma.trainingProgramActivation.create({
      data: {
        startDate: data.startDate,
        owner: {
          connect: {
            id: userId,
          },
        },
        trainingProgram: {
          connect: {
            id: data.trainingProgramId,
          },
        },
      },
    });
  }

  async updateActivation(
    data: z.infer<TrainingProgramActivationSchema>,
    activationId: string,
    userId: string
  ) {
    this.validateReadAccess(data.trainingProgramId, userId);

    return await this.prisma.trainingProgramActivation.update({
      where: {
        id: activationId,
      },
      data: {
        startDate: data.startDate,
        trainingProgram: {
          connect: {
            id: data.trainingProgramId,
          },
        },
      },
    });
  }

  async deleteActivation(trainingProgramId: string, activationId: string, userId: string) {
    this.validateReadAccess(trainingProgramId, userId);

    return await this.prisma.trainingProgramActivation.delete({
      where: {
        id: activationId,
      },
    });
  }

  async delete(id: string, userId: string) {
    this.validateReadAccess(id, userId);

    return await this.prisma.trainingProgram.delete({
      where: {
        id,
      },
    });
  }
}
