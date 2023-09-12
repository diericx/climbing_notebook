import { prisma } from '$lib/prisma';
import { TrainingCycleRepo } from '$lib/trainingCycle';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = locals.auth.validate();

  const trainingCycleRepo = new TrainingCycleRepo(prisma);

  const trainingCycles = await trainingCycleRepo.get({
    trainingProgramId: null,
    isPublic: true,
  });

  return {
    trainingCycles,
  };
};
