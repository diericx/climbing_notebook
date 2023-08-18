import { CustomQueryRepo, type CustomQueryResults } from '$lib/customQuery';
import { ExerciseRepo } from '$lib/exercise';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { WidgetRepo } from '$lib/widget';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSessionOrRedirect } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const widgetRepo = new WidgetRepo(prisma);
  const customQueryRepo = new CustomQueryRepo(prisma);
  const exerciseRepo = new ExerciseRepo(prisma);
  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const id = params.id;

  try {
    // Editing can only be done by the owner
    const widget = await widgetRepo.getOneAndValidateOwner(id, user?.userId);

    const trainingPrograms = await trainingProgramRepo.get(user?.userId);
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

    const exercises = await exerciseRepo.get({
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
      trainingPrograms,
      customQueryResults,
      exercises,
    };
  } catch (e) {
    console.error(e);
    throw error(500, { message: SERVER_ERROR });
  }
};
