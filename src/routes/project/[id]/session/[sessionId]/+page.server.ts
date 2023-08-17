import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { SERVER_ERROR } from '$lib/helperTypes';
import { ProjectRepo, projectSchema, projectSessionSchema } from '$lib/project';
import { superValidate } from 'sveltekit-superforms/server';
import { APIError } from '$lib/errors';

export const actions: Actions = {
  delete: async ({ locals, url, params }) => {
    const { user } = await locals.auth.validate();
    const projectId = params.id;
    const sessionId = params.sessionId;

    const repo = new ProjectRepo(prisma);
    try {
      await repo.deleteSession(projectId, sessionId, user?.userId);
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

  edit: async ({ locals, request, url, params }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validate();
    const projectId = params.id;
    const sessionId = params.sessionId;
    const form = await superValidate(formData, projectSessionSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProjectRepo(prisma);
    try {
      await repo.updateSession(form.data, projectId, sessionId, user?.userId);
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
