import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { datasetSchema, WidgetRepo, widgetSchema } from '$lib/widget';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const actions: Actions = {
  update: async ({ locals, request, url, params }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(formData, widgetSchema, {
      id: formData.get('_formId')?.toString(),
    });
    const id = params.id;

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new WidgetRepo(prisma);
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
  delete: async ({ locals, url, params }) => {
    const id = params.id;
    const { user } = await locals.auth.validateUser();

    const repo = new WidgetRepo(prisma);
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

    return {};
  },

  // Create a new template from this widget
  newTemplate: async ({ locals, url, params }) => {
    const id = params.id;
    const { user } = await locals.auth.validateUser();

    const repo = new WidgetRepo(prisma);
    try {
      const template = await repo.newTemplate(id, user?.userId);

      if (url.searchParams.has('redirectTo')) {
        throw redirect(303, url.searchParams.get('redirectTo') || '/');
      }
      return template;
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail });
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }
  },
};
