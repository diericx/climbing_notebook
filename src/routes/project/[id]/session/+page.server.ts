import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { SERVER_ERROR } from '$lib/helperTypes';
import { ProjectRepo, projectSessionSchema } from '$lib/project';
import { superValidate } from 'sveltekit-superforms/server';
import { APIError } from '$lib/errors';

export const actions: Actions = {
  new: async ({ locals, request, url, params }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const id = params.id;
    const form = await superValidate(formData, projectSessionSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProjectRepo(prisma);
    try {
      await repo.addSession(form.data, id, user?.userId);
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
  },
}
