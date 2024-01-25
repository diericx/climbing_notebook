import { ExerciseRepo } from '$lib/exercise';
import { prisma } from '$lib/prisma';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, params }) => {
  const { user } = await getSessionOrRedirect({ locals, url });
  const exerciseRepo = new ExerciseRepo(prisma);
  const exercise = await exerciseRepo.getOne({
    id: params.id,
    userId: user.userId,
    select: ExerciseRepo.selectEverything,
  });
  return {
    exercise,
  };
};
