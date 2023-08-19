import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { ExerciseEventRepo, exerciseEventSchema } from '$lib/exerciseEvent';
import { ProfileRepo } from '$lib/profile';
import { superValidate } from 'sveltekit-superforms/server';
import { ExerciseRepo } from '$lib/exercise';
import { getSessionOrRedirect } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const exerciseEventsRepo = new ExerciseEventRepo(prisma);
  const exerciseRepo = new ExerciseRepo(prisma);
  const profileRepo = new ProfileRepo(prisma);
  const exerciseEvents = await exerciseEventsRepo.get(user?.userId);
  const profile = await profileRepo.getOne(user?.userId);
  const exercises = await exerciseRepo.get({
    _count: {
      select: {
        exerciseEvents: true,
      },
    },
    id: true,
    name: true,
    fieldsToShow: true,
  });

  return {
    exercises,
    exerciseEvents,
    profile,
    user,
  };
};

export const actions: Actions = {
  new: async ({ locals, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, exerciseEventSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ExerciseEventRepo(prisma);
    await repo.new(form.data, user?.userId);

    const exerciseToMarkCompletedId = formData.get('exerciseToMarkCompletedId');
    const dateToMarkCompleted = formData.get('dateToMarkCompleted');
    if (exerciseToMarkCompletedId != null && dateToMarkCompleted != null) {
      await repo.setCompleted(
        Number(exerciseToMarkCompletedId),
        user?.userId,
        new Date(dateToMarkCompleted.toString()),
        true
      );
    }

    return { form };
  },
};
