import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const trainingProgramRepo = new TrainingProgramRepo(prisma);

  const trainingPrograms = await trainingProgramRepo.get({
    ownerId: user.userId,
  });

  const trainingProgramActivations = await trainingProgramRepo.getActivations(user?.userId);
  return {
    trainingPrograms,
    trainingProgramActivations,
  };
};
