import { ExerciseEventRepo } from '$lib/exerciseEvent';
import { prisma } from '$lib/server/prisma';
import { loadFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = loadFlash(async ({ locals }) => {
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
});
