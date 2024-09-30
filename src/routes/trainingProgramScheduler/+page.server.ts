import { trainingProgramSelects } from '$lib/prismaHelpers/trainingProgramHelper';
import { prisma } from '$lib/server/prisma';
import { ProfileRepo } from '$lib/server/repos/profile';
import { TrainingProgramRepo } from '$lib/server/repos/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const profileRepo = new ProfileRepo(prisma);

  const profile = await profileRepo.getOne(user?.userId);

  const ownedTrainingPrograms = await trainingProgramRepo.getManyForUser({
    userId: user.userId,
    select: trainingProgramSelects.everything,
  });
  const savedTrainingPrograms = await trainingProgramRepo.getManySavedForUser({
    userId: user.userId,
    select: trainingProgramSelects.everything,
  });

  return {
    ownedTrainingPrograms,
    savedTrainingPrograms,
    profile,
  };
};
