import { calendarEventSelects } from '$lib/prismaHelpers/calendarEventHelper';
import { exerciseEventSelects } from '$lib/prismaHelpers/exerciseEventHelper';
import { journalEntrySelects } from '$lib/prismaHelpers/journalEntryHelper';
import { prisma } from '$lib/server/prisma';
import { CalendarEventRepo } from '$lib/server/repos/calendarEvent';
import { ExerciseEventRepo } from '$lib/server/repos/exerciseEventRepo';
import { JournalEntryRepo } from '$lib/server/repos/journalEntry';
import { TrainingProgramRepo } from '$lib/server/repos/trainingProgram';
import { Prisma, type CalendarEvent, type JournalEntry } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export type ApiCalendarEventGet = {
  journalEntries: JournalEntry[];
  calendarEvents: CalendarEvent[];
  exerciseEvents: Prisma.ExerciseEventGetPayload<typeof exerciseEventSelects.minimalValidator>[];
  trainingProgramActivations: Prisma.TrainingProgramActivationGetPayload<{
    include: {
      trainingProgram: {
        select: {
          name: true;
          trainingProgramScheduledSlots: {
            select: {
              duration: true;
              trainingCycles: {
                select: {
                  name: true;
                };
              };
            };
          };
        };
      };
    };
  }>[];
};

export const GET: RequestHandler = async ({ url, locals }) => {
  const session = await locals.auth.validate();
  if (session === null) {
    throw error(403);
  }

  const user = session.user;
  const journalEntryRepo = new JournalEntryRepo(prisma);
  const calendarEventRepo = new CalendarEventRepo(prisma);
  const exerciseEventRepo = new ExerciseEventRepo(prisma);
  const trainingProgramRepo = new TrainingProgramRepo(prisma);

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

  const journalEntries = await journalEntryRepo.getManyForUser({
    userId: user?.userId,
    select: journalEntrySelects.minimal,
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  const exerciseEvents = await exerciseEventRepo.getManyForUser({
    userId: user?.userId,
    select: exerciseEventSelects.minimal,
    dateMin: startDate,
    // This is inclusive but should be exclusive... may cause issues
    dateMax: endDate,
  });

  const trainingProgramActivations = await trainingProgramRepo.getActivations({
    ownerId: user?.userId,
    where: {
      startDate: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return json({
    journalEntries,
    calendarEvents,
    exerciseEvents,
    trainingProgramActivations,
  });
};
