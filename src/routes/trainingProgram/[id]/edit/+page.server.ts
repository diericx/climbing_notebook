import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const id = params.id;

  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const trainingProgram = await trainingProgramRepo.getOneAndValidateOwner(id, user?.userId);

  return {
    trainingProgram,
  };
};
