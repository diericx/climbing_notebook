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

  async findOne<S extends Prisma.CalendarEventSelect>(
    id: number,
    select: S
  ): Promise<Prisma.CalendarEventGetPayload<{ select: S }>> {
    const calendarEvent = await this.prisma.calendarEvent.findUnique({
      where: {
        id,
      },
      select,
    });
    if (calendarEvent == null) {
      throw new APIError('NOT_FOUND');
    }
    return calendarEvent;
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

  async get(ownerId: string) {
    // Fetch all
    return await this.prisma.calendarEvent.findMany({
      where: {
        ownerId: ownerId,
      },
      orderBy: {
        dateStart: 'desc',
      },
    });
  }

  async update(data: z.infer<CalendarEventPartialSchema>, id: number, ownerId: string) {
    const calendarEvent = await this.findOne(id, { ownerId: true });
    if (calendarEvent.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS');
    }

    return await this.prisma.calendarEvent.update({
      data,
      where: {
        id: Number(id),
      },
    });
  }

  async delete(id: number, ownerId: string) {
    const calendarEvent = await this.findOne(id, { ownerId: true });
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
