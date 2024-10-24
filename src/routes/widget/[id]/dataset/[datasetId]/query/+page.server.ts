import { prisma } from '$lib/server/prisma';
import { CustomQueryRepo } from '$lib/server/repos/customQuery';
import { getSessionOrRedirect } from '$lib/utils';
import { customQuerySchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const actions: Actions = {
  new: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, zod(customQuerySchema), {
      id: formData.get('_formId')?.toString(),
    });
    const datasetId = params.datasetId;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new CustomQueryRepo(prisma);
    await repo.new(form.data, datasetId, user?.userId);

    return { form };
  },
};
