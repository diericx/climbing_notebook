import { trainingCycleSelects } from '$lib/prismaHelpers/trainingCycleHelper';
import { trainingProgramSelects } from '$lib/prismaHelpers/trainingProgramHelper';
import { prisma } from '$lib/server/prisma';
import { TrainingCycleRepo } from '$lib/server/repos/trainingCycleRepo';
import { TrainingProgramRepo } from '$lib/server/repos/trainingProgram';
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
    select: trainingProgramSelects.everything,
  });
  const ownedTrainingCycles = await trainingCycleRepo.getManyForUser({
    userId: user.userId,
    query: 'owned',
    extraFilters: {
      isTemplate: true,
    },
    select: trainingCycleSelects.nameAndId,
  });
  const savedTrainingCycles = await trainingCycleRepo.getManyForUser({
    userId: user.userId,
    query: 'saved',
    select: trainingCycleSelects.nameAndId,
  });

  return {
    trainingProgram,
    ownedTrainingCycles,
    savedTrainingCycles,
  };
};
