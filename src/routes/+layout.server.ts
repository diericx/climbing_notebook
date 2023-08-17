import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';
import { ExerciseEventRepo } from '$lib/exerciseEvent';

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.auth.validate();
  const exerciseEventsRepo = new ExerciseEventRepo(prisma);
  let countOfExercisesThatNeedMigration = 0;
  if (user) {
    countOfExercisesThatNeedMigration =
      await exerciseEventsRepo.getCountOfExercisesThatNeedMigration(user.userId);
  }

  return {
    user,
    countOfExercisesThatNeedMigration,
  };
};
