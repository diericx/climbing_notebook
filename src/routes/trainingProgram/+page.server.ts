import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { prisma, type ProfileWithActiveTrainingProgram } from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { ProfileRepo } from '$lib/profile';
import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { TrainingProgramRepo, trainingProgramSchema } from '$lib/trainingProgram';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.auth.validateUser();

  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  let trainingPrograms;
  try {
    trainingPrograms = await trainingProgramRepo.get(user?.userId);
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  const repo = new ProfileRepo(prisma);
  let profile: ProfileWithActiveTrainingProgram;
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
    trainingPrograms,
    profile,
  }
}

export const actions: Actions = {
  new: async ({ locals, request, url }) => {
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(request, trainingProgramSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.new(form.data, user?.userId)
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
