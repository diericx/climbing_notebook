import type { Actions } from './$types';
import { prisma } from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { APIError, throwAPIErrorAsHttpError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { CustomQueryRepo, customQuerySchema } from '$lib/customQuery';
import { evaluate } from 'mathjs';
import { getSessionOrRedirect } from '$lib/utils';

export const actions: Actions = {
  new: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, customQuerySchema, {
      id: formData.get('_formId')?.toString(),
    });
    const datasetId = params.datasetId;

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
    // Check if equation is valid by attempting to solve the equation
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
    } catch (e: any) {
      throw new APIError('INVALID_INPUT', e.toString());
    }

    const repo = new CustomQueryRepo(prisma);
    try {
      await repo.new(form.data, datasetId, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        throwAPIErrorAsHttpError(e);
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },
};
