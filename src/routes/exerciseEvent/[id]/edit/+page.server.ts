import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { SERVER_ERROR } from '$lib/helperTypes';
import { ExerciseEventRepo, exerciseEventSchema } from '$lib/exerciseEvent';
import { APIError } from '$lib/errors';
import { prisma } from '$lib/prisma';
import { superValidate } from 'sveltekit-superforms/server';

export const actions: Actions = {
  deleteExerciseEvent: async ({ locals, params, url }) => {
    const { user } = await locals.auth.validateUser();
    const id = Number(params.id);

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
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const id = Number(params.id);
    const form = await superValidate(formData, exerciseEventSchema, {
      id: formData.get('_formId')?.toString(),
    });


    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ExerciseEventRepo(prisma);
    try {
      await repo.update(form.data, id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, form })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },

  setCompleted: async ({ locals, params, request }) => {
    const formData = await request.formData()
    const { user } = await locals.auth.validateUser();
    const id = Number(params.id);
    const dateInput = formData.get('date')?.toString()

    if (!dateInput) {
      return fail(401, { message: 'date is required' })
    }

    const isCompleted = formData.has('isCompleted');
    const date = new Date(dateInput);

    const repo = new ExerciseEventRepo(prisma);
    try {
      await repo.setCompleted(id, user?.userId, date, isCompleted);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    return { success: true }
  }
}
