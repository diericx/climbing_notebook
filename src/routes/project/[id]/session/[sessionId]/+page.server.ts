import { prisma } from '$lib/prisma';
import { ProjectRepo } from '$lib/project';
import { getSessionOrRedirect } from '$lib/utils';
import { projectSessionSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const actions: Actions = {
  delete: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const projectId = params.id;
    const sessionId = params.sessionId;

    const repo = new ProjectRepo(prisma);
    await repo.deleteSession(projectId, sessionId, user?.userId);

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

    return { form };
  },
};
