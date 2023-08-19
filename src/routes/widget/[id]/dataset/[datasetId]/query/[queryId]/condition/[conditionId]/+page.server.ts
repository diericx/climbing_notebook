import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { superValidate } from 'sveltekit-superforms/server';
import { customQueryConditionSchema, CustomQueryRepo } from '$lib/customQuery';
import { getSessionOrRedirect } from '$lib/utils';

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

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },

  delete: async ({ params, locals, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const queryId = params.queryId;
    const conditionId = params.conditionId;

    const repo = new CustomQueryRepo(prisma);
    await repo.deleteCondition(queryId, conditionId, user?.userId);

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return {};
  },
};
