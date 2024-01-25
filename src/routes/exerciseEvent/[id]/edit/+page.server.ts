import { ExerciseEventRepo } from '$lib/exerciseEvent';
import { prisma } from '$lib/server/prisma';
import { getSessionOrRedirect } from '$lib/utils';
import { exerciseEventSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

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
