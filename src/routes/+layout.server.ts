import { ExerciseEventRepo } from '$lib/exerciseEvent';
import { prisma } from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals.auth.validate();
  if (session === null) {
    return {};
  }
  const { user } = session;

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
