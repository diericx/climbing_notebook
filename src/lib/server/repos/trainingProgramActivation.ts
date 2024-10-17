import type { Prisma, PrismaClient } from '@prisma/client';

export class TrainingProgramActivationRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async get(
    where: Prisma.TrainingProgramActivationWhereInput,
    trainingCycleSaves?: Prisma.TrainingCycle$savesArgs,
    trainingCycleActivations?: Prisma.TrainingCycle$activationsArgs,
  ) {
    return await this.prisma.trainingProgramActivation.findMany({
      where,
      include: {
        trainingProgram: {
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
                    saves: trainingCycleSaves,
                    activations: trainingCycleActivations,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
