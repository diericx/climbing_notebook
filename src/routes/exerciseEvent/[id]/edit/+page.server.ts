import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { SERVER_ERROR } from '$lib/helperTypes';
import { ExerciseEventRepo, exerciseEventSchema } from '$lib/exerciseEvent';
import { APIError } from '$lib/errors';
import { prisma } from '$lib/prisma';
import { superValidate } from 'sveltekit-superforms/server';
import { getSessionOrRedirect } from '$lib/utils';

export const actions: Actions = {
  deleteExerciseEvent: async ({ locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new ExerciseEventRepo(prisma);
    await repo.delete(id, user?.userId);

    return { success: true };
  },

  editExerciseEvent: async ({ locals, params, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const id = Number(params.id);
    const form = await superValidate(formData, exerciseEventSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ExerciseEventRepo(prisma);
    await repo.update(form.data, id, user?.userId);

    return { form };
  },

  setCompleted: async ({ locals, params, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const id = Number(params.id);
    const dateInput = formData.get('date')?.toString();

    if (!dateInput) {
      return fail(401, { message: 'date is required' });
    }

    const isCompleted = formData.has('isCompleted');
    const date = new Date(dateInput);

    const repo = new ExerciseEventRepo(prisma);
    await repo.setCompleted(id, user?.userId, date, isCompleted);

    return { success: true };
  },
};
