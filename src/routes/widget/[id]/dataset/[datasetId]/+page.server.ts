import { prisma } from '$lib/prisma';
import { datasetSchema, WidgetRepo } from '$lib/widget';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';
import { getSessionOrRedirect } from '$lib/utils';

export const actions: Actions = {
  delete: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const widgetId = params.id;
    const datasetId = params.datasetId;

    const repo = new WidgetRepo(prisma);
    await repo.deleteDataset(widgetId, datasetId, user?.userId);

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return {};
  },

  update: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, datasetSchema, {
      id: formData.get('_formId')?.toString(),
    });
    const widgetId = params.id;
    const datasetId = params.datasetId;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new WidgetRepo(prisma);
    await repo.updateDataset(form.data, widgetId, datasetId, user?.userId);

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },
};
