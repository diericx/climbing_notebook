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
  const trainingProgram = await trainingProgramRepo.getOne({
    id,
    userId: user?.userId,
    select: TrainingProgramRepo.selectEverything,
  });
  const ownedTrainingCycles = await trainingCycleRepo.getManyForUser({
    userId: user.userId,
    query: 'owned',
    extraFilters: {
      isTemplate: true,
    },
    select: TrainingCycleRepo.selectNameOnly,
  });
  const savedTrainingCycles = await trainingCycleRepo.getManyForUser({
    userId: user.userId,
    query: 'saved',
    select: TrainingCycleRepo.selectNameOnly,
  });

  return {
    trainingProgram,
    ownedTrainingCycles,
    savedTrainingCycles,
  };
};
