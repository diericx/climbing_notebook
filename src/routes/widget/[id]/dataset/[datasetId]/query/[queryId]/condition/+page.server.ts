import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { superValidate } from 'sveltekit-superforms/server';
import { customQueryConditionSchema, CustomQueryRepo, customQuerySchema } from '$lib/customQuery';
import { getSessionOrRedirect } from '$lib/utils';

export const actions: Actions = {
  new: async ({ request, locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, customQueryConditionSchema, {
      id: formData.get('_formId')?.toString(),
    });
    const queryId = params.queryId;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new CustomQueryRepo(prisma);
    await repo.addCondition(form.data, queryId, user?.userId);

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },
};
