import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ExerciseEvent } from '@prisma/client';
import { SERVER_ERROR } from '$lib/helperTypes';
import { ExerciseEventFormData, ExerciseEventRepo } from '$lib/exerciseEvent';
import { APIError } from '$lib/errors';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validateUser();
  const id = Number(params.id);

  const repo = new ExerciseEventRepo(prisma);
  let exerciseEvent: ExerciseEvent;
  try {
    exerciseEvent = await repo.getOne(id, user?.userId);
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  return {
    exerciseEvent,
  };
};

export const actions: Actions = {
  deleteExerciseEvent: async ({ locals, request, url }) => {
    const { user } = await locals.auth.validateUser();
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const id = Number(rawFormData.id)

    const repo = new ExerciseEventRepo(prisma);
    try {
      await repo.delete(id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },

  editExerciseEvent: async ({ locals, params, request, url }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();
    const id = Number(params.id);

    // Validate input fields
    const input = new ExerciseEventFormData({ isMarkedCompleted: rawFormData.isMarkedCompleted == 'on' });

    const repo = new ExerciseEventRepo(prisma);
    try {
      await repo.update(input, id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, exerciseEventFormData: rawFormData })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  }

}
