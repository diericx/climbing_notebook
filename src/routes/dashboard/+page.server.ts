import { JournalEntryRepo } from '$lib/journalEntry';
import { MetricRepo } from '$lib/metric';
import { calendarEventSelects } from '$lib/prismaHelpers/calendarEventHelper';
import { exerciseEventSelects } from '$lib/prismaHelpers/exerciseEventHelper';
import { trainingCycleSelects } from '$lib/prismaHelpers/trainingCycleHelper';
import { widgetSelects } from '$lib/prismaHelpers/widgetHelper';
import { ProfileRepo } from '$lib/profile';
import { prisma } from '$lib/server/prisma';
import { CalendarEventRepo } from '$lib/server/repos/calendarEvent';
import { CustomQueryRepo, type CustomQueryResults } from '$lib/server/repos/customQuery';
import { ExerciseRepo } from '$lib/server/repos/exercise';
import { ExerciseEventRepo } from '$lib/server/repos/exerciseEventRepo';
import { TrainingCycleRepo } from '$lib/server/repos/trainingCycleRepo';
import { WidgetRepo } from '$lib/server/repos/widgetRepo';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
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
  const exerciseEvents = await exerciseEventRepo.getManyForUser({
    userId: user?.userId,
    select: exerciseEventSelects.minimal,
  });
  const exercises = await exerciseRepo.getMany({
    select: ExerciseRepo.selectMinimal,
  });
  // Get metris in the past month for the charts
  const metrics = await metricRepo.get(user?.userId);
  const journalEntries = await journalEntryRepo.getManyForUser({
    userId: user?.userId,
    select: JournalEntryRepo.selectMinimal,
  });
  const calendarEvents = await calendarEventRepo.getManyForUser({
    userId: user.userId,
    select: calendarEventSelects.everything,
  });
  const ownedTrainingPrograms = await trainingProgramRepo.getManyForUser({
    userId: user.userId,
    select: TrainingProgramRepo.selectEverything,
  });
  const savedTrainingPrograms = await trainingProgramRepo.getManySavedForUser({
    userId: user.userId,
    select: TrainingProgramRepo.selectEverything,
  });
  const trainingProgramActivations = trainingProgramRepo.getActivations(user?.userId);

  const widgets = await widgetRepo.getManyForUserDashboardWidgets(
    user.userId,
    widgetSelects.everything
  );

  const trainingCycles = await trainingCycleRepo.getManyForUser({
    userId: user.userId,
    query: 'owned',
    select: trainingCycleSelects.nameAndId,
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
