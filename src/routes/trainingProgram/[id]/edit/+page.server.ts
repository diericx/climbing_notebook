import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { ExerciseRepo } from '$lib/exercise';
import { getSessionOrRedirect } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const id = Number(params.id);

  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const exerciseRepo = new ExerciseRepo(prisma);
  const trainingProgram = await trainingProgramRepo.getOneAndValidateOwner(
    Number(id),
    user?.userId
  );
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
    trainingProgram,
    exercises,
  };
};
