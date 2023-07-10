import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { APIError } from '$lib/errors';
import { superValidate } from 'sveltekit-superforms/server';
import { customQueryConditionSchema, CustomQueryRepo, customQuerySchema } from '$lib/customQuery';
import type { PageServerLoad } from './$types';
import type { ExerciseEvent, Metric } from '@prisma/client';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validateUser();
  const id = params.id;

  const repo = new CustomQueryRepo(prisma);
  try {
    const query = await repo.getOneAndValidateOwner(id, user?.userId);
    let exerciseEvents: ExerciseEvent[] = [];
    let metrics: Metric[] = [];

    if (query.conditions.length > 0) {
      const results = await repo.runCustomQuery(id, user?.userId);
      // Cast the arrays for type safety
      if (query.table == 'exerciseEvent') {
        exerciseEvents = results;
      } else if (query.table == 'metric') {
        metrics = results;
      }
    }
    return {
      query,
      exerciseEvents,
      metrics,
    };
  } catch (e) {
    if (e instanceof APIError) {
      throw error(404, { message: 'Not found' });
    }
    console.error(e);
    throw error(500, { message: SERVER_ERROR });
  }
};

export const actions: Actions = {
  update: async ({ request, locals, params, url }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(formData, customQuerySchema, {
      id: formData.get('_formId')?.toString(),
    });
    const id = params.id;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new CustomQueryRepo(prisma);
    try {
      await repo.update(form.data, id, user?.userId);
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
    const id = params.id;

    const repo = new CustomQueryRepo(prisma);
    try {
      await repo.delete(id, user?.userId);
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

  addCondition: async ({ request, locals, params, url }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(formData, customQueryConditionSchema, {
      id: formData.get('_formId')?.toString(),
    });
    const id = params.id;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new CustomQueryRepo(prisma);
    try {
      await repo.addCondition(form.data, id, user?.userId);
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
};
