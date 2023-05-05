import type { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';
import type { ProfileWithActiveTrainingProgram } from './prisma';

export const profileSchema = z.object({
  goals: z.string().nullish(),
  activeTrainingProgramId: z.number().nullish(),
});
export type ProfileSchema = typeof profileSchema;

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

  async update(data: z.infer<ProfileSchema>, ownerId: string): Promise<ProfileWithActiveTrainingProgram> {
    await this.getOneAndValidateOwner(ownerId);

    return await this.prisma.profile.update({
      data: {
        ...data,
      },
      where: {
        ownerId,
      },
    }) as ProfileWithActiveTrainingProgram;
  }
}
