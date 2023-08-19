import { APIError, throwAPIErrorAsHttpError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { datasetSchema, WidgetRepo } from '$lib/widget';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';
import { getSessionOrRedirect } from '$lib/utils';

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
    try {
      await repo.addDataset(form.data, id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        throwAPIErrorAsHttpError(e);
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },
};
