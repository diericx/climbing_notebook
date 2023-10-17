import { CalendarEventRepo } from '$lib/calendarEvent';
import { CustomQueryRepo, type CustomQueryResults } from '$lib/customQuery';
import { ExerciseRepo } from '$lib/exercise';
import { ExerciseEventRepo } from '$lib/exerciseEvent';
import { JournalEntryRepo } from '$lib/journalEntry';
import { MetricRepo } from '$lib/metric';
import { prisma } from '$lib/prisma';
import { ProfileRepo } from '$lib/profile';
import { TrainingCycleRepo } from '$lib/trainingCycle';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import { WidgetRepo } from '$lib/widget';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const profileRepo = new ProfileRepo(prisma);
  const exerciseEventRepo = new ExerciseEventRepo(prisma);
  const metricRepo = new MetricRepo(prisma);
  const journalEntryRepo = new JournalEntryRepo(prisma);
  const calendarEventRepo = new CalendarEventRepo(prisma);
  const widgetRepo = new WidgetRepo(prisma);
  const customQueryRepo = new CustomQueryRepo(prisma);
  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const exerciseRepo = new ExerciseRepo(prisma);

  const profile = await profileRepo.getOne(user?.userId);
  const exerciseEvents = await exerciseEventRepo.get(user?.userId);
  const exercises = await exerciseRepo.getSelect({
    _count: {
      select: {
        exerciseEvents: true,
      },
    },
    id: true,
    name: true,
    fieldsToShow: true,
  });
  // Get metris in the past month for the charts
  const metrics = await metricRepo.get(user?.userId);
  const journalEntries = await journalEntryRepo.get(user?.userId);
  const calendarEvents = await calendarEventRepo.get(user?.userId);
  const ownedTrainingPrograms = await trainingProgramRepo.get({
    ownerId: user.userId,
  });
  const savedTrainingPrograms = await trainingProgramRepo.get({
    saves: {
      some: {
        userId: user.userId,
      },
    },
  });
  const trainingProgramActivations = trainingProgramRepo.getActivations(user?.userId);

  const widgets = await widgetRepo.getAllDashboardWidgetsForUser(user.userId, {
    owner: true,
    trainingCycle: {
      include: {
        days: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
            exerciseGroups: {
              include: {
                exercises: {
                  include: {
                    exercise: true,
                  },
                },
              },
            },
          },
        },
      },
    },
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
  });

  const trainingCycles = await trainingCycleRepo.findMany({
    where: {
      ownerId: user.userId,
    },
    select: TrainingCycleRepo.selectNameOnly,
  });

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
    exercises,
    metrics,
    journalEntries,
    calendarEvents,
    widgets,
    customQueryResults,
    trainingCycles,
    ownedTrainingPrograms,
    savedTrainingPrograms,
    trainingProgramActivations,
  };
};
