import { ExerciseRepo } from '$lib/exercise';
import { ExerciseEventRepo, exerciseEventSchema } from '$lib/exerciseEvent';
import { prisma } from '$lib/prisma';
import { ProfileRepo } from '$lib/profile';
import { getSessionOrRedirect } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const exerciseEventsRepo = new ExerciseEventRepo(prisma);
  const exerciseRepo = new ExerciseRepo(prisma);
  const profileRepo = new ProfileRepo(prisma);
  const exerciseEvents = await exerciseEventsRepo.get(user?.userId);
  const profile = await profileRepo.getOne(user?.userId);
  const exercises = await exerciseRepo.getSelect({
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
