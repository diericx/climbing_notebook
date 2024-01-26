import { exerciseSelects } from '$lib/prismaHelpers/exerciseHelper';
import { prisma } from '$lib/server/prisma';
import { ExerciseRepo } from '$lib/server/repos/exercise';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, params }) => {
  const { user } = await getSessionOrRedirect({ locals, url });
  const exerciseRepo = new ExerciseRepo(prisma);
  const exercise = await exerciseRepo.getOne({
    id: params.id,
    userId: user.userId,
    select: exerciseSelects.everything,
  });
  return {
    exercise,
  };
};
