import { ExerciseRepo } from '$lib/exercise';
import { trainingCycleSelects } from '$lib/prismaHelpers/trainingCycleHelper';
import { widgetSelects } from '$lib/prismaHelpers/widgetHelper';
import { prisma } from '$lib/server/prisma';
import { CustomQueryRepo, type CustomQueryResults } from '$lib/server/repos/customQuery';
import { TrainingCycleRepo } from '$lib/server/repos/trainingCycleRepo';
import { WidgetRepo } from '$lib/server/repos/widgetRepo';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const widgetRepo = new WidgetRepo(prisma);
  const customQueryRepo = new CustomQueryRepo(prisma);
  const exerciseRepo = new ExerciseRepo(prisma);
  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const id = params.id;

  // Editing can only be done by the owner
  const widget = await widgetRepo.getOne({
    id,
    userId: user.userId,
    select: widgetSelects.everything,
  });

  const trainingCycles = await trainingCycleRepo.getManyForUser({
    userId: user.userId,
    query: 'owned',
    select: trainingCycleSelects.nameAndId,
  });
  // compile datasets for widgets
  const customQueryResults: CustomQueryResults[] = [];
  // Go through each widget and fetch cooresponding query results
  if (widget.type == 'chart' || widget.type == 'heatmapCalendar') {
    for (const dataset of widget.datasets) {
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

  const exercises = await exerciseRepo.getMany({
    select: ExerciseRepo.selectMinimal,
  });

  return {
    widget,
    trainingCycles,
    customQueryResults,
    exercises,
  };
};
