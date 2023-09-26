import type { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';

export const profileSchema = z.object({
  goals: z.string().optional(),
  imageS3ObjectKey: z.string().nullish(),
});
export type ProfileSchema = typeof profileSchema;

export const profilePartialSchema = profileSchema.partial();
export type ProfilePartialSchema = typeof profilePartialSchema;

export class ProfileRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async getOne(ownerId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        ownerId: ownerId,
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

  async update(data: z.infer<ProfilePartialSchema>, ownerId: string) {
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
