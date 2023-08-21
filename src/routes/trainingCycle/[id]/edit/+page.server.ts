import { ExerciseRepo } from '$lib/exercise';
import { prisma } from '$lib/prisma';
import { TrainingCycleRepo } from '$lib/trainingCycle';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const id = Number(params.id);

  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const exerciseRepo = new ExerciseRepo(prisma);
  const trainingCycle = await trainingCycleRepo.getOneAndValidateOwner(Number(id), user?.userId);
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
    trainingCycle,
    exercises,
  };
};
