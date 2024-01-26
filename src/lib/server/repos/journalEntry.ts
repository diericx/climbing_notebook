import type { JournalEntry, Prisma, PrismaClient } from '@prisma/client';
import type { z } from 'zod';
import { APIError } from '../../errors';
import type { Repo } from '../../repo';
import { matchMetricsInString, parseMetricStrings, toNum } from '../../utils';
import type { JournalEntrySchema } from '../../zodSchemas';

export class JournalEntryRepo implements Repo<JournalEntry, Prisma.JournalEntrySelect> {
  constructor(private readonly prisma: PrismaClient) {}

  canUserRead(
    userId: string | undefined,
    journalEntry: Prisma.JournalEntryGetPayload<{
      select: { ownerId: true };
    }>
  ) {
    return journalEntry.ownerId == userId;
  }

  canUserUpdate(
    userId: string | undefined,
    journalEntry: Prisma.JournalEntryGetPayload<{
      select: { ownerId: true };
    }>
  ) {
    return journalEntry.ownerId == userId;
  }

  canUserDelete(
    userId: string | undefined,
    journalEntry: Prisma.JournalEntryGetPayload<{
      select: { ownerId: true };
    }>
  ) {
    return journalEntry.ownerId == userId;
  }

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

  async getOne<S extends Prisma.JournalEntrySelect>(options: {
    id: number;
    userId: string;
    select: S;
  }) {
    const { id, userId, select } = options;
    const journalEntry = await this.prisma.journalEntry.findUnique({
      where: {
        id,
      },
      select: { ...select, ownerId: true } as S,
    });
    if (journalEntry == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }

    const _journalEntry = journalEntry as Prisma.JournalEntryGetPayload<{
      select: S;
    }> &
      Prisma.JournalEntryGetPayload<{
        select: { ownerId: true };
      }>;
    if (!this.canUserRead(userId, _journalEntry)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return _journalEntry;
  }

  async getManyForUser<S extends Prisma.JournalEntrySelect>(options: {
    userId: string;
    select: S;
  }) {
    const { userId, select } = options;

    return (await this.prisma.journalEntry.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        date: 'desc',
      },
      select: { ...select, ownerId: true } as S,
    })) as JournalEntry[];
  }

  async update(data: z.infer<JournalEntrySchema>, id: number, userId: string) {
    const journalEntry = await this.getOne({ id, userId, select: { id: true } });
    if (!this.canUserUpdate(userId, journalEntry)) {
      throw new APIError('INVALID_PERMISSIONS');
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
        ownerId: userId,
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
        ownerId: userId,
      })),
    });
    await this.prisma.$transaction([deleteMetrics, createMetrics]);

    return journalUpdateResult;
  }

  async delete(id: number, userId: string) {
    const journalEntry = await this.getOne({ id, userId, select: { id: true } });
    if (!this.canUserDelete(userId, journalEntry)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return await this.prisma.journalEntry.delete({
      where: {
        id,
      },
    });
  }
}
