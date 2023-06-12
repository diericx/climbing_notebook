import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { SERVER_ERROR } from '$lib/helperTypes';
import { ExerciseEventRepo, exerciseEventSchema } from '$lib/exerciseEvent';
import { ExerciseRepo } from '$lib/exercise';

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.auth.validateUser();
  const exerciseEventsRepo = new ExerciseEventRepo(prisma);
  const exerciseRepo = new ExerciseRepo(prisma);
  try {
    const exerciseEvent = await exerciseEventsRepo.getOneThatNeedsExerciseMigration();
    const exercises = await exerciseRepo.get({
      _count: {
        select: {
          exerciseEvents: true,
        }
      },
      id: true,
      name: true,
      fieldsToShow: true,
    });

    return {
      exercises,
      exerciseEvent,
      user
    };
  } catch (e) {
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }
};
