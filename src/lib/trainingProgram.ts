import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';

export const trainingProgramSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});
export type TrainingProgramSchema = typeof trainingProgramSchema;

export class TrainingProgramRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async getOne(id: string) {
    const trainingProgram = await this.prisma.trainingProgram.findUnique({
      where: {
        id,
      },
      include: {
        trainingProgramScheduledSlots: {
          orderBy: {
            order: 'asc',
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

  async get(ownerId: string) {
    // Fetch all
    return await this.prisma.trainingProgram.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        trainingCycles: true,
        trainingProgramActivations: true,
      },
    });
  }

  async update(data: z.infer<TrainingProgramSchema>, id: string, ownerId: string) {
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

  async delete(id: string, ownerId: string) {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.trainingProgram.delete({
      where: {
        id,
      },
    });
  }
}
