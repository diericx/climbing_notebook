import type { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';

export const profileSchema = z.object({
  goals: z.string().optional(),
  activeTrainingCycleId: z.number().nullish().optional(),
});
export type ProfileSchema = typeof profileSchema;

export class ProfileRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async getOne(ownerId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        ownerId: ownerId,
      },
      include: {
        activeTrainingCycle: {
          include: {
            days: {
              include: {
                exercises: {
                  orderBy: {
                    name: 'desc',
                  },
                  include: {
                    exercise: true,
                  },
                },
                exerciseGroups: {
                  include: {
                    exercises: {
                      orderBy: {
                        name: 'desc',
                      },
                      include: {
                        exercise: {
                          select: {
                            name: true,
                          },
                        },
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
    });
    if (profile == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    return profile;
  }

  async getOneAndValidateOwner(ownerId: string) {
    const profile = await this.getOne(ownerId);
    if (profile.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
    }
    return profile;
  }

  async update(data: z.infer<ProfileSchema>, ownerId: string) {
    await this.getOneAndValidateOwner(ownerId);

    return await this.prisma.profile.update({
      data: {
        ...data,
      },
      where: {
        ownerId,
      },
    });
  }
}
