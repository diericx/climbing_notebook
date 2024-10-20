import { prisma } from '$lib/server/prisma';
import { CustomQueryRepo } from '$lib/server/repos/customQuery';
import { getSessionOrRedirect } from '$lib/utils';
import { customQueryConditionSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const actions: Actions = {
  new: async ({ request, locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, zod(customQueryConditionSchema), {
      id: formData.get('_formId')?.toString(),
    });
    const queryId = params.queryId;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new CustomQueryRepo(prisma);
    await repo.addCondition(form.data, queryId, user?.userId);

    return { form };
  },
};
