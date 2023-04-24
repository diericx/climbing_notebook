import type { CalendarEvent, PrismaClient } from '@prisma/client';
import { isNaN } from 'mathjs';
import { APIError } from './errors';

export class CalendarEventFormData {
  dateStart: Date | undefined = undefined;
  dateEnd: Date | undefined = undefined;
  title: string | undefined = undefined
  content: string | undefined = undefined;
  color: string | undefined = undefined;

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { dateStart, dateEnd, title, content, color } = obj;
    this.dateStart = dateStart == undefined ? undefined : new Date(dateStart);
    this.dateEnd = dateEnd == undefined ? undefined : new Date(dateEnd);
    this.title = title;
    this.content = content;
    this.color = color;
  }

  validate() {
    if (!this.dateStart || isNaN(this.dateStart.valueOf()) || !this.dateEnd || isNaN(this.dateEnd.valueOf())) {
      return {
        isValid: false,
        message: 'Invalid date.'
      }
    }

    if (this.title == '') {
      return {
        isValid: false,
        message: 'Title is required.'
      }
    }

    return {
      isValid: true,
      message: '',
    }
  }
}

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

  async new(data: CalendarEventFormData, ownerId: string): Promise<CalendarEvent> {
    const { title, content, dateStart, dateEnd, color } = data;
    if (title == undefined || content == undefined || !dateStart || !dateEnd || color == undefined) {
      throw new APIError('INVALID_INPUT', 'All fields required on create');
    }
    return await this.prisma.calendarEvent.create({
      data: {
        title,
        content,
        dateStart,
        dateEnd,
        color,
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

  async update(data: CalendarEventFormData, id: number, ownerId: string): Promise<CalendarEvent> {
    await this.getOneAndValidateOwner(id, ownerId);
    const { title, content, dateStart, dateEnd, color } = data;

    return await this.prisma.calendarEvent.update({
      data: {
        title,
        content,
        dateStart,
        dateEnd,
        color
      },
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
