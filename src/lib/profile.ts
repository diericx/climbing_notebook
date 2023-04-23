import type { PrismaClient } from '@prisma/client';
import { APIError } from './errors';
import type { ProfileWithActiveTrainingProgram } from './prisma';

export class ProfileFormData {
  goals: string | undefined = undefined;
  activeTrainingProgramId: number | undefined;

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { goals, activeTrainingProgramId } = obj;
    this.goals = goals == undefined ? this.goals : goals;
    this.activeTrainingProgramId = activeTrainingProgramId == undefined ? this.activeTrainingProgramId : Number(activeTrainingProgramId);
  }

  validate() {
    return {
      isValid: true,
      message: '',
    }
  }
}

export class ProfileRepo {
  constructor(private readonly prisma: PrismaClient) { }

  async getOneAndValidateOwner(ownerId: string): Promise<ProfileWithActiveTrainingProgram> {
    // Fetch
    const profile = await this.prisma.profile.findUnique({
      where: {
        ownerId: ownerId,
      },
      include: {
        activeTrainingProgram: {
          include: {
            days: {
              include: {
                exercises: {
                  orderBy: {
                    name: 'desc'
                  }
                },
                exerciseGroups: {
                  include: {
                    exercises: {
                      orderBy: {
                        name: 'desc'
                      }
                    },
                  },
                }
              },
              orderBy: {
                // Note: ui depends on this being sorted in this way
                dayOfTheWeek: 'asc',
              },
            },
          }
        }
      }
    });
    if (profile == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (profile.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.')
    }
    return profile
  }

  async getOne(ownerId: string): Promise<ProfileWithActiveTrainingProgram> {
    return this.getOneAndValidateOwner(ownerId)
  }

  async update(data: ProfileFormData, ownerId: number): Promise<ProfileWithActiveTrainingProgram> {
    await this.getOneAndValidateOwner(ownerId);

    return await this.prisma.profile.update({
      data: {
        // TODO: Don't deconstruct?
        ...data,
      },
      where: {
        ownerId,
      },
    }) as ProfileWithActiveTrainingProgram;
  }
}
