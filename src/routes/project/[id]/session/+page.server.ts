import { prisma } from '$lib/server/prisma';
import { ProjectRepo } from '$lib/server/repos/project';
import { getSessionOrRedirect } from '$lib/utils';
import { projectSessionSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const actions: Actions = {
  new: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const id = params.id;
    const form = await superValidate(formData, zod(projectSessionSchema), {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProjectRepo(prisma);
    await repo.addSession(form.data, id, user?.userId);

    return { form };
  },
};
