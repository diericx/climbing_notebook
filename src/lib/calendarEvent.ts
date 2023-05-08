import type { CalendarEvent, PrismaClient } from '@prisma/client';
import { APIError } from './errors';
import { z } from 'zod';

export const calendarEventSchema = z.object({
  dateStart: z.date().default(new Date()),
  dateEnd: z.date().default(new Date()),
  title: z.string().min(1).default(''),
  content: z.string().nullish(),
  color: z.string().default('green')
});
export const calendarEventPartialSchema = calendarEventSchema.partial();
export type CalendarEventSchema = typeof calendarEventSchema;
export type CalendarEventPartialSchema = typeof calendarEventPartialSchema;

export class CalendarEventRepo {
  constructor(private readonly prisma: PrismaClient) { }

  async getOneAndValidateOwner(id: number, ownerId: string): Promise<CalendarEvent> {
    const e = await this.prisma.calendarEvent.findUnique({
      where: {
        id: Number(id),
      }
    });
    if (e == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (e.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.')
    }
    return e
  }

  async new(data: z.infer<CalendarEventSchema>, ownerId: string): Promise<CalendarEvent> {
    return await this.prisma.calendarEvent.create({
      data: {
        ...data,
        ownerId,
        createdAt: new Date(),
      }
    });
  }

  async get(ownerId: string): Promise<CalendarEvent[]> {
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

  async getOne(id: number, ownerId: string): Promise<CalendarEvent> {
    return this.getOneAndValidateOwner(id, ownerId)
  }

  async update(data: z.infer<CalendarEventPartialSchema>, id: number, ownerId: string): Promise<CalendarEvent> {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.calendarEvent.update({
      data,
      where: {
        id: Number(id),
      },
    });
  }

  async delete(id: number, ownerId: string): Promise<CalendarEvent> {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.calendarEvent.delete({
      where: {
        id: Number(id)
      }
    })
  }
}
