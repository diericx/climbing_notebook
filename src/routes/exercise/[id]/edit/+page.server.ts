import { ExerciseRepo } from '$lib/exercise';
import { prisma } from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const exerciseRepo = new ExerciseRepo(prisma);
  const exercise = await exerciseRepo.getOne(params.id);
  return {
    exercise,
  };
};
