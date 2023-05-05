import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { ChartFormData, ChartRepo, chartSchema } from '$lib/chart';
import { prisma } from '$lib/prisma';
import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async ({ url }) => {
  const redirectTo = url.searchParams.get('redirectTo');

  return {
    redirectTo,
  };
};

export const actions: Actions = {
  newChart: async ({ request, url, locals }) => {
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(request, chartSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ChartRepo(prisma);
    try {
      await repo.new(form.data, user?.userId)
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, form })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true, form };
  },
}
