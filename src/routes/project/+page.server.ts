import { prisma } from '$lib/server/prisma';
import { ProjectRepo } from '$lib/server/repos/project';
import { getSessionOrRedirect } from '$lib/utils';
import { projectSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const repo = new ProjectRepo(prisma);
  const projects = await repo.get(user?.userId);

  return {
    projects,
  };
};

export const actions: Actions = {
  new: async ({ request, url, locals }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, zod(projectSchema), {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProjectRepo(prisma);
    await repo.new(form.data, user?.userId);

    return { form };
  },
};
