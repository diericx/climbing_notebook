import type { Actions } from './$types';
import { SERVER_ERROR } from '$lib/helperTypes';
import { error } from 'console';
import { fail, redirect } from '@sveltejs/kit';
import { ChartRepo, chartSchema, datasetSchema } from '$lib/chart';
import { prisma } from '$lib/prisma';
import { APIError } from '$lib/errors';
import { superValidate } from 'sveltekit-superforms/server';

export const actions: Actions = {
  edit: async ({ locals, params, request, url }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(formData, chartSchema, {
      id: formData.get('_formId')?.toString(),
    });
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

  delete: async ({ locals, request, url }) => {
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
  addDataset: async ({ locals, request, url, params }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(formData, datasetSchema, {
      id: formData.get('_formId')?.toString(),
    });
    const id = params.id;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ChartRepo(prisma);
    try {
      await repo.addDataset(form.data, id, user?.userId)
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

    return { form };
  }
}
