import { APIError } from '$lib/errors';
import { ExerciseEventRepo } from '$lib/exerciseEvent';
import { SERVER_ERROR } from '$lib/helperTypes';
import { MetricRepo } from '$lib/metric';
import { prisma } from '$lib/prisma';
import { ProfileRepo } from '$lib/profile';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { JournalEntryRepo } from '$lib/journalEntry';
import { CalendarEventRepo } from '$lib/calendarEvent';
import { WidgetRepo } from '$lib/widget';
import { CustomQueryRepo, type CustomQueryResults } from '$lib/customQuery';
import { TrainingProgramRepo } from '$lib/trainingProgram';

export const load: PageServerLoad = async ({ locals }) => {
  // Unprotected page, session may not exist
  const { user } = await locals.auth.validateUser();

  const profileRepo = new ProfileRepo(prisma);
  const exerciseEventRepo = new ExerciseEventRepo(prisma);
  const metricRepo = new MetricRepo(prisma);
  const journalEntryRepo = new JournalEntryRepo(prisma);
  const calendarEventRepo = new CalendarEventRepo(prisma);
  const widgetRepo = new WidgetRepo(prisma);
  const customQueryRepo = new CustomQueryRepo(prisma);
  const trainingProgramRepo = new TrainingProgramRepo(prisma);

  try {
    const profile = await profileRepo.getOne(user?.userId);
    // Get exercise events in the past month for the charts
    const dateMin = new Date();
    dateMin.setDate(dateMin.getDate() - 31);
    const exerciseEvents = await exerciseEventRepo.get(user?.userId, dateMin, new Date());
    // Get metris in the past month for the charts
    const metrics = await metricRepo.get(user?.userId, dateMin, new Date());
    const journalEntries = await journalEntryRepo.get(user?.userId);
    const calendarEvents = await calendarEventRepo.get(user?.userId);

    const widgets = await widgetRepo.get({
      where: { ownerId: user?.userId, isTemplate: false },
      include: {
        owner: true,
        trainingProgram: true,
        datasets: {
          include: {
            customQueries: {
              include: {
                conditions: true,
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
      },
    });

    const trainingPrograms = await trainingProgramRepo.get(user?.userId);

    // compile datasets for widgets
    const customQueryResults: CustomQueryResults[] = [];
    for (const w of widgets) {
      // Go through each widget and fetch cooresponding query results
      if (w.type == 'chart' || w.type == 'heatmapCalendar') {
        for (const dataset of w.datasets) {
          for (const customQuery of dataset.customQueries) {
            // Don't run the same queries multiple times
            if (customQueryResults.find((r) => r.customQueryId == customQuery.id)) {
              continue;
            }

            const data = await customQueryRepo.runCustomQuery(customQuery.id, user?.userId);
            customQueryResults.push({
              customQueryId: customQuery.id,
              data,
            });
          }
        }
      }
    }

    return {
      user,
      profile,
      exerciseEvents,
      metrics,
      journalEntries,
      calendarEvents,
      widgets,
      customQueryResults,
      trainingPrograms,
    };
  } catch (e) {
    if (e instanceof APIError) {
      throw error(401, { message: e.detail });
    }
    console.error(e);
    throw error(500, { message: SERVER_ERROR });
  }
};
