import { APIError } from '$lib/errors';
import { prisma } from '$lib/prisma';
import { TrainingCycleRepo } from '$lib/trainingCycle';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, params }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const id = params.id;

  const trainingCycle = await trainingCycleRepo.getOne(Number(id));
  if (!trainingCycle.isPublic) {
    throw new APIError('INVALID_PERMISSIONS', 'This Training Cycle is not public');
  }

  return {
    trainingCycle,
    user,
  };
};
