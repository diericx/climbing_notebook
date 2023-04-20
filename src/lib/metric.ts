import type { Metric, PrismaClient } from '@prisma/client';

export class MetricRepo {
  constructor(private readonly prisma: PrismaClient) { }

  async get(ownerId: number, dateMin?: Date | undefined, dateMax?: Date | undefined): Promise<ExerciseEvent[]> {
    // Fetch all
    return await this.prisma.metric.findMany({
      where: {
        ownerId: ownerId,
        date: {
          lte: dateMax ? new Date(dateMax) : undefined,
          gte: dateMin ? new Date(dateMin) : undefined,
        },
      },
      orderBy: {
        date: 'desc',
      },
    }) as Metric[];
  }

}

