import { APIError } from '$lib/errors';
import { prisma } from '$lib/prisma';
import { TrainingCycleRepo } from '$lib/trainingCycle';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
  const session = locals.auth.validate();

  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const id = params.id;

  const trainingCycle = await trainingCycleRepo.getOne(Number(id));
  if (!trainingCycle.isPublic) {
    throw new APIError('INVALID_PERMISSIONS', 'This Training Cycle is not public');
  }

  return {
    trainingCycle,
    session,
  };
};
