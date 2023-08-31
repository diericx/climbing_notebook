import { prisma } from '$lib/prisma';
import { TrainingCycleRepo } from '$lib/trainingCycle';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const trainingCycleRepo = new TrainingCycleRepo(prisma);

  const trainingCycles = await trainingCycleRepo.get(user?.userId, {
    trainingProgramId: null,
    isTemplate: true,
  });

  return {
    trainingCycles,
    user,
  };
};
