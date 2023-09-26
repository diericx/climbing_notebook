import { prisma } from '$lib/prisma';
import { TrainingCycleRepo } from '$lib/trainingCycle';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const id = params.id;

  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const trainingProgram = await trainingProgramRepo.getOneAndValidateOwner(id, user?.userId);
  const ownedTrainingCycles = await trainingCycleRepo.get({
    ownerId: user.userId,
    trainingProgramId: null,
  });
  const savedTrainingCycles = await trainingCycleRepo.get({
    saves: {
      some: {
        userId: user.userId,
      },
    },
  });

  return {
    trainingProgram,
    ownedTrainingCycles,
    savedTrainingCycles,
  };
};
