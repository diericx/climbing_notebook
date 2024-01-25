import { prisma } from '$lib/server/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const trainingProgramRepo = new TrainingProgramRepo(prisma);

  const ownedTrainingPrograms = await trainingProgramRepo.getManyForUser({
    userId: user.userId,
    select: TrainingProgramRepo.selectEverything,
  });
  const savedTrainingPrograms = await trainingProgramRepo.getManySavedForUser({
    userId: user.userId,
    select: TrainingProgramRepo.selectEverything,
  });

  const trainingProgramActivations = await trainingProgramRepo.getActivations(user?.userId);
  return {
    ownedTrainingPrograms,
    savedTrainingPrograms,
    trainingProgramActivations,
  };
};
