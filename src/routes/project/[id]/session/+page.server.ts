import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { SERVER_ERROR } from '$lib/helperTypes';
import { ProjectRepo, projectSessionSchema } from '$lib/project';
import { superValidate } from 'sveltekit-superforms/server';
import { APIError } from '$lib/errors';
import { getSessionOrRedirect } from '$lib/utils';

export const actions: Actions = {
  new: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const id = params.id;
    const form = await superValidate(formData, projectSessionSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProjectRepo(prisma);
    await repo.addSession(form.data, id, user?.userId);

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },
};
