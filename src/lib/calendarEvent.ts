import { Prisma, type PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';

export const calendarEventSchema = z.object({
  dateStart: z.date().default(new Date()),
  dateEnd: z.date().default(new Date()),
  title: z.string().min(1).default(''),
  content: z.string().nullish(),
  color: z.string().default('green'),
});
export const calendarEventPartialSchema = calendarEventSchema.partial();
export type CalendarEventSchema = typeof calendarEventSchema;
export type CalendarEventPartialSchema = typeof calendarEventPartialSchema;

export class CalendarEventRepo {
  constructor(private readonly prisma: PrismaClient) {}

  static makeCalendarEventSelect<T extends Prisma.CalendarEventSelect>(
    select: Prisma.Subset<T, Prisma.CalendarEventSelect>
  ): T {
    return select;
  }

  static selectEverything = this.makeCalendarEventSelect({
    id: true,
    ownerId: true,
    dateStart: true,
    dateEnd: true,
    title: true,
    content: true,
    color: true,
  });
  static selectEverythingValidator = Prisma.validator<Prisma.CalendarEventDefaultArgs>()({
    select: CalendarEventRepo.selectEverything,
  });

  async new(data: z.infer<CalendarEventSchema>, ownerId: string) {
    return await this.prisma.calendarEvent.create({
      data: {
        ...data,
        ownerId,
        createdAt: new Date(),
      },
    });
  }

  async getOne<S extends Prisma.CalendarEventSelect>(
    id: number,
    ownerId: string,
    select: S
  ): Promise<Prisma.CalendarEventGetPayload<{ select: S }>> {
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

    if (_calendarEvent.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return calendarEvent;
  }

  async getManyForUser<S extends Prisma.CalendarEventSelect>(
    userId: string,
    select: S
  ): Promise<Prisma.CalendarEventGetPayload<{ select: S }>[]> {
    // Fetch all
    return await this.prisma.calendarEvent.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        dateStart: 'desc',
      },
      select,
    });
  }

  async update(data: z.infer<CalendarEventPartialSchema>, id: number, ownerId: string) {
    await this.getOne(id, ownerId, { ownerId: true });

    return await this.prisma.calendarEvent.update({
      data,
      where: {
        id: Number(id),
      },
    });
  }

  async delete(id: number, ownerId: string) {
    const calendarEvent = await this.getOne(id, ownerId, { ownerId: true });
    if (calendarEvent.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return await this.prisma.calendarEvent.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
