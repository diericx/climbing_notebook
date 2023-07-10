import type { JournalEntry, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';
import { matchMetricsInString, parseMetricStrings, toNum } from './utils';

export const journalEntrySchema = z.object({
  date: z.date().default(new Date()),
  content: z.string().min(1).default(''),
  type: z.string().default('climbing'),
});
export type JournalEntrySchema = typeof journalEntrySchema;

export class JournalEntryRepo {
  constructor(private readonly prisma: PrismaClient) {}
  async new(data: z.infer<JournalEntrySchema>, ownerId: string) {
    const minDate = new Date(data.date.toISOString().split('T')[0]);
    const maxDate = new Date(data.date.toISOString().split('T')[0]);
    maxDate.setDate(maxDate.getDate() + 1);
    // Fetch journalEntries with same day to validate this is a new date
    const journalEntries: JournalEntry[] = (await this.prisma.journalEntry.findMany({
      where: {
        AND: [
          {
            ownerId,
          },
          {
            date: {
              gte: minDate,
            },
          },
          {
            date: {
              lt: maxDate,
            },
          },
        ],
      },
    })) as JournalEntry[];
    if (journalEntries.length > 0) {
      throw new APIError('UNIQUENESS_COLLISION', 'A journal entry for that date already exists');
    }

    // Add new journal entry
    const journalEntry: JournalEntry = (await this.prisma.journalEntry.create({
      data: {
        ...data,
        date: new Date(data.date),
        ownerId: ownerId,
        createdAt: new Date(),
      },
    })) as JournalEntry;

    const metrics = parseMetricStrings(matchMetricsInString(data.content));
    await this.prisma.metric.createMany({
      data: metrics.map((m) => ({
        name: m.name,
        // Number parse is implied succesful with regex match?
        value: toNum(m.value, 0),
        date: new Date(data.date),
        journalEntryId: Number(journalEntry.id),
        ownerId: ownerId,
      })),
    });

    return journalEntry;
  }

  async get(ownerId: string) {
    return (await this.prisma.journalEntry.findMany({
      where: {
        ownerId: ownerId,
      },
      orderBy: {
        date: 'desc',
      },
    })) as JournalEntry[];
  }

  async getOne(id: number, ownerId: string) {
    const journalEntry = await this.prisma.journalEntry.findUnique({
      where: {
        id,
      },
    });
    if (journalEntry == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (journalEntry.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
    }

    return journalEntry;
  }

  async update(data: z.infer<JournalEntrySchema>, id: number, ownerId: string) {
    const journalEntry = await this.prisma.journalEntry.findUnique({
      where: {
        id,
      },
    });
    if (journalEntry == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (journalEntry.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
    }

    const journalUpdateResult = await this.prisma.journalEntry.update({
      data: {
        date: new Date(data.date),
        content: data.content,
        type: data.type,
      },
      where: {
        id: Number(id),
      },
    });

    const metrics = parseMetricStrings(matchMetricsInString(data.content));
    const deleteMetrics = this.prisma.metric.deleteMany({
      where: {
        ownerId,
        journalEntryId: Number(journalEntry.id),
      },
    });
    const createMetrics = this.prisma.metric.createMany({
      data: metrics.map((m) => ({
        name: m.name,
        // Number parse is implied succesful with regex match?
        value: toNum(m.value, 0),
        date: new Date(data.date),
        journalEntryId: Number(journalEntry.id),
        ownerId: ownerId,
      })),
    });
    await this.prisma.$transaction([deleteMetrics, createMetrics]);

    return journalUpdateResult;
  }

  async delete(id: number, ownerId: string) {
    const journalEntry = await this.prisma.journalEntry.findUnique({
      where: {
        id,
      },
    });
    if (journalEntry == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (journalEntry.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
    }

    return await this.prisma.journalEntry.delete({
      where: {
        id,
      },
    });
  }
}
