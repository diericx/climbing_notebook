import type { Actions, PageServerLoad } from './$types';
import { SERVER_ERROR } from '$lib/helperTypes';
import { error } from 'console';
import { fail, redirect } from '@sveltejs/kit';
import { ChartRepo, chartSchema } from '$lib/chart';
import { prisma } from '$lib/prisma';
import { APIError } from '$lib/errors';
import type { Chart } from '@prisma/client';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validateUser();
  const id = Number(params.id);

  const repo = new ChartRepo(prisma);
  let chart: Chart;
  try {
    chart = await repo.getOne(id, user?.userId);
  } catch (e) {
    if (e instanceof APIError) {
      throw error(404, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }
  const newChartForm = await superValidate(chart, chartSchema);

  return {
    chart,
    newChartForm
  };
};

export const actions: Actions = {
  edit: async ({ locals, params, request, url }) => {
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(request, chartSchema);
    const id = Number(params.id);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ChartRepo(prisma);
    try {
      await repo.update(form.data, id, user?.userId);
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

  deleteChart: async ({ locals, request, url }) => {
    const { user } = await locals.auth.validateUser();
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const id = Number(rawFormData.id)

    const repo = new ChartRepo(prisma);
    try {
      await repo.delete(id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },
}
