import type { Actions } from './$types';
import { prisma } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { CustomQueryRepo, customQuerySchema } from '$lib/customQuery';
import { getSessionOrRedirect } from '$lib/utils';

export const actions: Actions = {
  new: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, customQuerySchema, {
      id: formData.get('_formId')?.toString(),
    });
    const datasetId = params.datasetId;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new CustomQueryRepo(prisma);
    await repo.new(form.data, datasetId, user?.userId);

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },
};
