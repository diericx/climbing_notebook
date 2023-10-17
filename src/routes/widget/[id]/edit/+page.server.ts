import { CustomQueryRepo, type CustomQueryResults } from '$lib/customQuery';
import { ExerciseRepo } from '$lib/exercise';
import { prisma } from '$lib/prisma';
import { TrainingCycleRepo } from '$lib/trainingCycle';
import { getSessionOrRedirect } from '$lib/utils';
import { WidgetRepo } from '$lib/widget';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const widgetRepo = new WidgetRepo(prisma);
  const customQueryRepo = new CustomQueryRepo(prisma);
  const exerciseRepo = new ExerciseRepo(prisma);
  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const id = params.id;

  // Editing can only be done by the owner
  const widget = await widgetRepo.getOneAndValidateOwner(id, user?.userId);

  const trainingCycles = await trainingCycleRepo.findMany({
    where: {
      ownerId: user.userId,
    },
    select: TrainingCycleRepo.nameOnlySelect(),
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

  return {
    widget,
    trainingCycles,
    customQueryResults,
    exercises,
  };
};
