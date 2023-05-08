import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { SERVER_ERROR } from '$lib/helperTypes';
import type { Profile } from '@prisma/client';
import { prisma } from '$lib/prisma';
import { ProfileRepo, profileSchema } from '$lib/profile';
import { APIError } from '$lib/errors';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.auth.validateUser();

  const repo = new ProfileRepo(prisma);
  let profile: Profile;
  try {
    profile = await repo.getOne(user?.userId);
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  return {
    profile,
  };
};

export const actions: Actions = {
  editProfile: async ({ locals, request, url }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(formData, profileSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ProfileRepo(prisma);
    try {
      await repo.update(form.data, user?.userId);
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
