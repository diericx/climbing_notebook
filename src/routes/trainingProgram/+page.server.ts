import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { prisma, type ProfileWithActiveTrainingProgram } from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { ProfileRepo } from '$lib/profile';
import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { TrainingProgramFormData, TrainingProgramRepo } from '$lib/trainingProgram';

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
  newTrainingProgram: async ({ locals, request, url }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();

    // Validate input fields
    const input = new TrainingProgramFormData(rawFormData);
    const { message, isValid } = input.validate()
    if (!isValid) {
      return fail(401, { message, trainingProgramFormData: rawFormData })
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.new(input, user?.userId)
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, trainingProgramFormData: rawFormData })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },
}
