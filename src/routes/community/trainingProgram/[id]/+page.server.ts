import { APIError } from '$lib/errors';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
  const session = await locals.auth.validate();

  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const id = params.id;

  const trainingProgram = await trainingProgramRepo.getOne(id);
  if (!trainingProgram.isPublic) {
    throw new APIError('INVALID_PERMISSIONS', 'This Training Program is not public');
  }

  return {
    trainingProgram,
    session,
  };
};
