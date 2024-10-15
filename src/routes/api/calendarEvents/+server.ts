import { calendarEventSelects } from '$lib/prismaHelpers/calendarEventHelper';
import { prisma } from '$lib/server/prisma';
import { CalendarEventRepo } from '$lib/server/repos/calendarEvent';
import { type CalendarEvent } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export type APICalendarEventsResponse = CalendarEvent[];

export const GET: RequestHandler = async ({ url, locals }) => {
  const session = await locals.auth.validate();
  if (session === null) {
    throw error(403);
  }

  const user = session.user;
  const calendarEventRepo = new CalendarEventRepo(prisma);

  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');

  if (start == null) {
    throw error(401, 'Must specify start date');
  }
  if (end == null) {
    throw error(401, 'Must specify end date');
  }

  // Workaround for time zone adjustmants made by date... and the fact that
  // date coming from calendar is not full iso string... lame
  const startDate = new Date(start);
  startDate.setUTCHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setUTCHours(0, 0, 0, 0);

  const calendarEvents = await calendarEventRepo.getManyForUser({
    userId: user.userId,
    select: calendarEventSelects.everything,
    where: {
      OR: [
        {
          dateStart: {
            gte: startDate,
            lt: endDate,
          },
        },
        {
          dateEnd: {
            gte: startDate,
            lt: endDate,
          },
        },
      ],
    },
  });

  return json(calendarEvents);
};
