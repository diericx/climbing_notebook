import type { PrismaClient, TrainingProgram } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';
import type { ExerciseGroupFormData } from './exerciseGroup';
import type { ExerciseGroupComplete, TrainingProgramComplete, TrainingProgramDayComplete } from './prisma';
import type { TrainingProgramDayFormData } from './trainingProgramDay';


export const trainingProgramSchema = z.object({
  name: z.string(),
});
export type TrainingProgramSchema = typeof trainingProgramSchema;

export class TrainingProgramRepo {
  constructor(private readonly prisma: PrismaClient) { }

  async getOneAndValidateOwner(id: number, ownerId: string): Promise<TrainingProgramComplete> {
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

  async new(data: z.infer<TrainingProgramSchema>, ownerId: string): Promise<TrainingProgram> {
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

  async get(ownerId: string): Promise<TrainingProgram[]> {
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

  async getOne(id: number, ownerId: string): Promise<TrainingProgramComplete> {
    return this.getOneAndValidateOwner(id, ownerId)
  }

  async update(data: z.infer<TrainingProgramSchema>, id: number, ownerId: string): Promise<TrainingProgram> {
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

  async delete(id: number, ownerId: string): Promise<TrainingProgram> {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.trainingProgram.delete({
      where: {
        id
      }
    })
  }

  async addExerciseGroup(exerciseGroup: ExerciseGroupFormData, id: number, ownerId: string): Promise<TrainingProgram> {
    if (exerciseGroup.name == undefined) {
      throw new APIError('INVALID_INPUT', '')
    }
    await this.getOneAndValidateOwner(id, ownerId);
    return await this.prisma.trainingProgram.update({
      where: {
        id
      },
      data: {
        exerciseGroups: {
          create: {
            ...exerciseGroup,
            name: exerciseGroup.name,
            owner: {
              connect: {
                id: ownerId,
              }
            }
          }
        }
      }
    })
  }

  async editExerciseGroup(exerciseGroup: ExerciseGroupFormData, trainingProgramId: number, exerciseGroupId: number, ownerId: string): Promise<TrainingProgram> {
    if (exerciseGroup.name == undefined) {
      throw new APIError('INVALID_INPUT', '')
    }
    await this.getOneAndValidateOwner(trainingProgramId, ownerId);
    return await this.prisma.trainingProgram.update({
      where: {
        id: trainingProgramId,
      },
      data: {
        exerciseGroups: {
          update: {
            where: {
              id: exerciseGroupId,
            },
            data: {
              ...exerciseGroup
            }
          }
        }
      }
    })
  }

  async deleteExerciseGroup(id: number, ownerId: string, exerciseGroupId: number): Promise<TrainingProgram> {
    await this.getOneAndValidateOwner(id, ownerId);
    return await this.prisma.trainingProgram.update({
      where: {
        id
      },
      data: {
        exerciseGroups: {
          delete: {
            id: exerciseGroupId,
          }
        }
      }
    })
  }

  async connectExerciseGroupToDay(trainingProgramId: number, groupId: number, trainingProgramDayId: number, ownerId: string): Promise<TrainingProgram> {
    await this.getOneAndValidateOwner(trainingProgramId, ownerId);
    return await this.prisma.trainingProgram.update({
      where: {
        id: trainingProgramId,
      },
      data: {
        days: {
          update: {
            where: {
              id: trainingProgramDayId,
            },
            data: {
              exerciseGroups: {
                connect: [{ id: groupId }]
              }
            }
          }
        }
      }
    })
  }

  async disconnectExerciseGroupFromDay(trainingProgramId: number, groupId: number, trainingProgramDayId: number, ownerId: string): Promise<TrainingProgram> {
    await this.getOneAndValidateOwner(trainingProgramId, ownerId);
    return await this.prisma.trainingProgram.update({
      where: {
        id: trainingProgramId,
      },
      data: {
        days: {
          update: {
            where: {
              id: trainingProgramDayId,
            },
            data: {
              exerciseGroups: {
                disconnect: [{ id: groupId }]
              }
            }
          }
        }
      }
    })
  }

  async editTrainingProgramDay(data: TrainingProgramDayFormData, trainingProgramId: number, trainingProgramDayId: number, ownerId: string): Promise<TrainingProgram> {
    await this.getOneAndValidateOwner(trainingProgramId, ownerId);
    return await this.prisma.trainingProgram.update({
      where: {
        id: trainingProgramId,
      },
      data: {
        days: {
          update: {
            where: {
              id: trainingProgramDayId,
            },
            data: {
              ...data
            }
          }
        }
      }
    })
  }
}
