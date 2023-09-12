import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals.auth.validate();

  const trainingProgramRepo = new TrainingProgramRepo(prisma);

  const trainingPrograms = await trainingProgramRepo.get({
    isPublic: true,
  });

  return {
    trainingPrograms,
    session,
  };
};
