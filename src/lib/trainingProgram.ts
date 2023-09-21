import type { Prisma, PrismaClient } from '@prisma/client';
import cuid from 'cuid';
import { z } from 'zod';
import { APIError } from './errors';

export const trainingProgramSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullish(),
  isPublic: z.boolean().optional().default(false),
});
export const trainingProgramPartialSchema = trainingProgramSchema.partial();
export type TrainingProgramSchema = typeof trainingProgramSchema;
export type TrainingProgramPartialSchema = typeof trainingProgramPartialSchema;

export const trainingProgramScheduledSlotSchema = z.object({
  duration: z.number().min(1, 'Duration must be greater than 0'),
  order: z.number(),
  trainingCycleId: z.number(),
});
export type TrainingProgramScheduledSlotSchema = typeof trainingProgramScheduledSlotSchema;

export const trainingProgramActivationSchema = z.object({
  startDate: z.date().default(new Date()),
  trainingProgramId: z.string(),
});
export type TrainingProgramActivationSchema = typeof trainingProgramActivationSchema;

export class TrainingProgramRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async getOne(id: string) {
    const trainingProgram = await this.prisma.trainingProgram.findUnique({
      where: {
        id,
      },
      include: {
        owner: true,
        trainingProgramScheduledSlots: {
          orderBy: {
            order: 'asc',
          },
          include: {
            trainingCycles: {
              include: {
                owner: true,
                trainingProgramScheduledSlots: true,
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
            },
          },
        },
        trainingCycles: true,
      },
    });
    if (trainingProgram == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    return trainingProgram;
  }

  async getOneAndValidateOwner(id: string, ownerId: string) {
    const trainingProgram = await this.getOne(id);
    if (trainingProgram.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to view this object.');
    }
    return trainingProgram;
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

  async get(where: Prisma.TrainingProgramWhereInput) {
    // Fetch all
    return await this.prisma.trainingProgram.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        owner: true,
        trainingProgramScheduledSlots: true,
        trainingCycles: true,
        trainingProgramActivations: true,
      },
    });
  }

  async update(data: z.infer<TrainingProgramPartialSchema>, id: string, ownerId: string) {
    // Get current training program
    const trainingProgram = await this.prisma.trainingProgram.findUnique({
      where: {
        id,
      },
    });
    if (trainingProgram == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (trainingProgram.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
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

  async duplicate(id: string, ownerId: string, data?: { name?: string }) {
    const trainingProgram = await this.prisma.trainingProgram.findUnique({
      where: {
        id,
      },
      include: {
        trainingCycles: true,
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
    if (trainingProgram == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    // Auth checks; only owner can duplicate, unless public
    if (trainingProgram.ownerId != ownerId && !trainingProgram.isPublic) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
    }

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
        ownerId,
        // Dupes always start private
        isPublic: false,
        trainingCycles: {
          create: trainingProgram.trainingCycles.map((c) => ({
            ...c,
            ownerId,
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

  async save(id: string, ownerId: string) {
    const trainingProgram = await this.getOne(id);
    if (!trainingProgram.isPublic || trainingProgram.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to view this program');
    }

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

  async unsave(id: string, ownerId: string) {
    const trainingProgram = await this.getOne(id);
    if (!trainingProgram.isPublic || trainingProgram.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to view this program');
    }

    await this.prisma.trainingProgram.update({
      where: {
        id,
      },
      data: {
        saves: {
          disconnect: {
            trainingProgramId_userId: {
              trainingProgramId: id,
              userId: ownerId,
            },
          },
        },
      },
    });
  }

  async addTrainingProgramScheduledSlot(
    data: z.infer<TrainingProgramScheduledSlotSchema>,
    id: string,
    ownerId: string
  ) {
    // Get current training program
    const trainingProgram = await this.prisma.trainingProgram.findUnique({
      where: {
        id,
      },
      include: {
        trainingProgramScheduledSlots: true,
      },
    });
    if (trainingProgram == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (trainingProgram.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
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
    trainingPrgramId: string,
    trainingProgramScheduledSlotId: string,
    ownerId: string
  ) {
    // Get current training program
    const trainingProgram = await this.prisma.trainingProgram.findUnique({
      where: {
        id: trainingPrgramId,
      },
      include: {
        trainingProgramScheduledSlots: true,
      },
    });
    if (trainingProgram == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (trainingProgram.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
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
        id: trainingPrgramId,
      },
    });

    return await this.prisma.$transaction([...decrementOrderOfSubsequentSlots, deleteSlot]);
  }

  async updateTrainingProgramScheduledSlot(
    data: z.infer<TrainingProgramScheduledSlotSchema>,
    trainingProgramId: string,
    slotId: string,
    ownerId: string
  ) {
    // Get current training program
    const trainingProgram = await this.prisma.trainingProgram.findUnique({
      where: {
        id: trainingProgramId,
      },
    });
    if (trainingProgram == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (trainingProgram.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
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
    trainingPrgramId: string,
    trainingProgramScheduledSlotId: string,
    order: number,
    ownerId: string
  ) {
    // Get current training program
    const trainingProgram = await this.prisma.trainingProgram.findUnique({
      where: {
        id: trainingPrgramId,
      },
      include: {
        trainingProgramScheduledSlots: true,
      },
    });
    if (trainingProgram == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (trainingProgram.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
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
              },
            },
          },
        },
      },
    });
  }

  async newActivation(data: z.infer<TrainingProgramActivationSchema>, ownerId: string) {
    this.getOneAndValidateOwner(data.trainingProgramId, ownerId);

    return await this.prisma.trainingProgramActivation.create({
      data: {
        startDate: data.startDate,
        owner: {
          connect: {
            id: ownerId,
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
    ownerId: string
  ) {
    this.getOneAndValidateOwner(data.trainingProgramId, ownerId);

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

  async deleteActivation(trainingProgramId: string, activationId: string, ownerId: string) {
    this.getOneAndValidateOwner(trainingProgramId, ownerId);

    return await this.prisma.trainingProgramActivation.delete({
      where: {
        id: activationId,
      },
    });
  }

  async delete(id: string, ownerId: string) {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.trainingProgram.delete({
      where: {
        id,
      },
    });
  }
}
