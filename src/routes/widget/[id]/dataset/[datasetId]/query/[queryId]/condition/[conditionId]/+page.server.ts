import { CustomQueryRepo } from '$lib/customQuery';
import { prisma } from '$lib/server/prisma';
import { getSessionOrRedirect } from '$lib/utils';
import { customQueryConditionSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const actions: Actions = {
  update: async ({ request, locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, customQueryConditionSchema, {
      id: formData.get('_formId')?.toString(),
    });
    const queryId = params.queryId;
    const conditionId = params.conditionId;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new CustomQueryRepo(prisma);
    await repo.updateCondition(form.data, queryId, conditionId, user?.userId);

    return { form };
  },

  delete: async ({ params, locals, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const queryId = params.queryId;
    const conditionId = params.conditionId;

    const repo = new CustomQueryRepo(prisma);
    await repo.deleteCondition(queryId, conditionId, user?.userId);

    return {};
  },
};
