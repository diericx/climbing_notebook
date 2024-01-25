import { ExerciseRepo } from '$lib/exercise';
import { prisma } from '$lib/prisma';
import { getSessionOrRedirect } from '$lib/utils';
import { exerciseSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const actions: Actions = {
  edit: async ({ locals, request, url, params }) => {
    await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, exerciseSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ExerciseRepo(prisma);
    await repo.update(form.data, params.id);

    return { form };
  },
};
