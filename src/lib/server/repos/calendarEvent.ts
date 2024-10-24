import type { CalendarEvent, Prisma, PrismaClient } from '@prisma/client';
import type { z } from 'zod';
import { APIError } from '../../errors';
import type { CalendarEventPartialSchema, CalendarEventSchema } from '../../zodSchemas';
import type { Repo } from './repo';

export class CalendarEventRepo implements Repo<CalendarEvent, Prisma.CalendarEventSelect> {
  constructor(private readonly prisma: PrismaClient) {}

  canUserRead(
    userId: string | undefined,
    calendarEvent: Prisma.CalendarEventGetPayload<{
      select: { ownerId: true };
    }>,
  ) {
    return calendarEvent.ownerId == userId;
  }

  canUserUpdate(
    userId: string | undefined,
    calendarEvent: Prisma.CalendarEventGetPayload<{
      select: { ownerId: true };
    }>,
  ) {
    return calendarEvent.ownerId == userId;
  }

  canUserDelete(
    userId: string | undefined,
    calendarEvent: Prisma.CalendarEventGetPayload<{
      select: { ownerId: true };
    }>,
  ) {
    return calendarEvent.ownerId == userId;
  }

  async new(data: z.infer<CalendarEventSchema>, ownerId: string) {
    return await this.prisma.calendarEvent.create({
      data: {
        ...data,
        ownerId,
        createdAt: new Date(),
      },
    });
  }

  async getOne<S extends Prisma.CalendarEventSelect>(options: {
    id: number;
    userId: string;
    select: S;
  }) {
    const { id, userId, select } = options;
    const calendarEvent = await this.prisma.calendarEvent.findUnique({
      where: {
        id,
      },
      select: { ...select, ownerId: true } as S,
    });
    if (calendarEvent == null) {
      throw new APIError('NOT_FOUND');
    }

    const _calendarEvent = calendarEvent as Prisma.CalendarEventGetPayload<{
      select: S;
    }> &
      Prisma.CalendarEventGetPayload<{
        select: { ownerId: true };
      }>;

    if (!this.canUserRead(userId, _calendarEvent)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return _calendarEvent;
  }

  async getManyForUser<S extends Prisma.CalendarEventSelect>(options: {
    userId: string;
    select: S;
    where?: Prisma.CalendarEventWhereInput;
  }): Promise<Prisma.CalendarEventGetPayload<{ select: S }>[]> {
    const { userId, select, where } = options;
    // Fetch all
    return await this.prisma.calendarEvent.findMany({
      where: {
        ownerId: userId,
        ...where,
      },
      orderBy: {
        dateStart: 'desc',
      },
      select,
    });
  }

  async update(data: z.infer<CalendarEventPartialSchema>, id: number, userId: string) {
    const calendarEvent = await this.getOne({ id, userId, select: {} });

    if (!this.canUserUpdate(userId, calendarEvent)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return await this.prisma.calendarEvent.update({
      data,
      where: {
        id: Number(id),
      },
    });
  }

  async delete(id: number, userId: string) {
    const calendarEvent = await this.getOne({ id, userId, select: { ownerId: true } });
    if (!this.canUserDelete(userId, calendarEvent)) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return await this.prisma.calendarEvent.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
