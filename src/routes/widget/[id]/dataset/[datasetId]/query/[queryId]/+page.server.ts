import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { APIError } from '$lib/errors';
import { message, superValidate } from 'sveltekit-superforms/server';
import { customQueryConditionSchema, CustomQueryRepo, customQuerySchema } from '$lib/customQuery';
import type { PageServerLoad } from './$types';
import type { ExerciseEvent, Metric } from '@prisma/client';

export const actions: Actions = {
  update: async ({ request, locals, params, url }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(formData, customQuerySchema, {
      id: formData.get('_formId')?.toString(),
    });
    const queryId = params.queryId;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new CustomQueryRepo(prisma);
    try {
      await repo.update(form.data, queryId, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, form });
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },

  delete: async ({ params, locals, url }) => {
    const { user } = await locals.auth.validateUser();
    const queryId = params.queryId;

    const repo = new CustomQueryRepo(prisma);
    try {
      await repo.delete(queryId, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail });
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },
};
