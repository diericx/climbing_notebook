import { calendarEventSelects } from '$lib/prismaHelpers/calendarEventHelper';
import { exerciseEventSelects } from '$lib/prismaHelpers/exerciseEventHelper';
import { journalEntrySelects } from '$lib/prismaHelpers/journalEntryHelper';
import { trainingCycleSelects } from '$lib/prismaHelpers/trainingCycleHelper';
import { trainingProgramSelects } from '$lib/prismaHelpers/trainingProgramHelper';
import { widgetSelects } from '$lib/prismaHelpers/widgetHelper';
import { prisma } from '$lib/server/prisma';
import { CalendarEventRepo } from '$lib/server/repos/calendarEvent';
import { CustomQueryRepo, type CustomQueryResults } from '$lib/server/repos/customQuery';
import { ExerciseEventRepo } from '$lib/server/repos/exerciseEventRepo';
import { JournalEntryRepo } from '$lib/server/repos/journalEntry';
import { MetricRepo } from '$lib/server/repos/metric';
import { ProfileRepo } from '$lib/server/repos/profile';
import { TrainingCycleRepo } from '$lib/server/repos/trainingCycleRepo';
import { TrainingProgramRepo } from '$lib/server/repos/trainingProgram';
import { WidgetRepo } from '$lib/server/repos/widgetRepo';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const profileRepo = new ProfileRepo(prisma);
  const metricRepo = new MetricRepo(prisma);
  const widgetRepo = new WidgetRepo(prisma);
  const customQueryRepo = new CustomQueryRepo(prisma);
  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const trainingProgramRepo = new TrainingProgramRepo(prisma);

  const profile = await profileRepo.getOne(user?.userId);
  // Get metris in the past month for the charts
  const metrics = await metricRepo.get(user?.userId);
  const ownedTrainingPrograms = await trainingProgramRepo.getManyForUser({
    userId: user.userId,
    select: trainingProgramSelects.everything,
  });
  const savedTrainingPrograms = await trainingProgramRepo.getManySavedForUser({
    userId: user.userId,
    select: trainingProgramSelects.everything,
  });

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
    metrics,
    widgets,
    customQueryResults,
    trainingCycles,
    ownedTrainingPrograms,
    savedTrainingPrograms,
  };
};
