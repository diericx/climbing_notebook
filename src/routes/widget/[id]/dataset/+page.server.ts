import { prisma } from '$lib/prisma';
import { getSessionOrRedirect } from '$lib/utils';
import { datasetSchema, WidgetRepo } from '$lib/widget';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const actions: Actions = {
  new: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const id = params.id;

    const form = await superValidate(formData, datasetSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new WidgetRepo(prisma);
    await repo.addDataset(form.data, id, user?.userId);

    return { form };
  },
};
