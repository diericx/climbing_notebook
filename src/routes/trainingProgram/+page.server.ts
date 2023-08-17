import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { ProfileRepo } from '$lib/profile';
import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { TrainingProgramRepo, trainingProgramSchema } from '$lib/trainingProgram';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await locals.auth.validate();
  if (!user) {
    throw redirect(302, '/login?redirectTo=' + url.toString());
  }

  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const profileRepo = new ProfileRepo(prisma);

  try {
    const trainingPrograms = await trainingProgramRepo.get(user?.userId);
    const profile = await profileRepo.getOne(user?.userId);
    return {
      trainingPrograms,
      profile,
    };
  } catch (e) {
    if (e instanceof APIError) {
      throw error(401, { message: SERVER_ERROR });
    }
    console.error(e);
    throw error(500, { message: SERVER_ERROR });
  }
};

export const actions: Actions = {
  new: async ({ locals, request, url }) => {
    const { user } = await locals.auth.validate();
    const form = await superValidate(request, trainingProgramSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.new(form.data, user?.userId);
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
