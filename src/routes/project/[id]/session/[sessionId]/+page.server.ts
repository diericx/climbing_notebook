import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { SERVER_ERROR } from '$lib/helperTypes';
import { ProjectRepo, projectSchema, projectSessionSchema } from '$lib/project';
import { superValidate } from 'sveltekit-superforms/server';
import { APIError } from '$lib/errors';
import { getSessionOrRedirect } from '$lib/utils';

export const actions: Actions = {
  delete: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const projectId = params.id;
    const sessionId = params.sessionId;

    const repo = new ProjectRepo(prisma);
    await repo.deleteSession(projectId, sessionId, user?.userId);

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return {};
  },

  edit: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const projectId = params.id;
    const sessionId = params.sessionId;
    const form = await superValidate(formData, projectSessionSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProjectRepo(prisma);
    await repo.updateSession(form.data, projectId, sessionId, user?.userId);

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },
};
