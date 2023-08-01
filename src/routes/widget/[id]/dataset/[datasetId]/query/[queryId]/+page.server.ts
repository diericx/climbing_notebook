import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { APIError } from '$lib/errors';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { customQueryConditionSchema, CustomQueryRepo, customQuerySchema } from '$lib/customQuery';
import type { PageServerLoad } from './$types';
import type { ExerciseEvent, Metric } from '@prisma/client';
import { evaluate } from 'mathjs';

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

    // Run more complicated checks
    // TODO: put this in the schema once superforms is updated
    if (form.data.table == 'exerciseEvent' && !form.data.exerciseId) {
      return setError(form, 'exerciseId', 'Exercise is required');
    }
    if (form.data.table == 'metric' && !form.data.metric) {
      return setError(form, 'metric', 'Metric is required');
    }

    const repo = new CustomQueryRepo(prisma);
    try {
      // Check if equation is valid
      try {
        if (form.data.table == 'exerciseEvent') {
          evaluate(form.data.equation, {
            sets: 0,
            reps: 0,
            weight: 0,
            minutes: 0,
            seconds: 0,
          });
        } else if (form.data.table == 'metric') {
          evaluate(form.data.equation, {
            value: 0,
          });
        }
      } catch (e) {
        return setError(form, 'equation', e.toString());
      }
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
