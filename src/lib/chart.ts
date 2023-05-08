import type { Chart, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';

export const chartSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  patternToMatch: z.string().superRefine((val, ctx) => {
    try {
      new RegExp(val, 'i')
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: e.message,
      });
    }
  }),
  matchAgainst: z.string(),
  equation: z.string(),
})
export type ChartSchema = typeof chartSchema;

export class ChartRepo {
  constructor(private readonly prisma: PrismaClient) { }

  async getOneAndValidateOwner(id: number, ownerId: string): Promise<Chart> {
    const chart = await this.prisma.chart.findUnique({
      where: {
        id: Number(id),
      }
    });
    if (chart == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (chart.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.')
    }
    return chart
  }

  async new(data: z.infer<ChartSchema>, ownerId: string): Promise<Chart> {
    return await this.prisma.chart.create({
      data: {
        ...data,
        ownerId: ownerId,
      }
    }) as Chart;
  }

  async get(ownerId: string): Promise<Chart[]> {
    // Fetch all
    return await this.prisma.chart.findMany({
      where: {
        ownerId: ownerId,
      },
      orderBy: {
        name: 'desc',
      },
    }) as Chart[];
  }

  async getOne(id: number, ownerId: string): Promise<Chart> {
    return this.getOneAndValidateOwner(id, ownerId)
  }

  async update(data: z.infer<ChartSchema>, id: number, ownerId: string): Promise<Chart> {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.chart.update({
      data,
      where: {
        id: Number(id),
      },
    });
  }

  async delete(id: number, ownerId: string): Promise<Chart> {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.chart.delete({
      where: {
        id: Number(id)
      }
    })
  }

}
