import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { TrainingProgramFormData, TrainingProgramRepo } from '$lib/trainingProgram';
import { APIError } from '$lib/errors';
import type { TrainingProgram } from '@prisma/client';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validateUser();
  const id = Number(params.id);

  try {
    const repo = new TrainingProgramRepo(prisma);
    const trainingProgram = await repo.getOne(Number(id), user?.userId);
    const trainingProgramOriginal = JSON.parse(JSON.stringify(trainingProgram));

    return {
      trainingProgram,
      trainingProgramOriginal,
    };
  } catch (e) {
    if (e instanceof APIError) {
      throw error(404, {
        message: 'Not found'
      });
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

};

export const actions: Actions = {
  deleteTrainingProgram: async ({ locals, request, url }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();
    const id = Number(rawFormData.id);

    const repo = new TrainingProgramRepo(prisma);
    let trainingProgram: TrainingProgram;
    try {
      trainingProgram = await repo.delete(id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true, trainingProgram };
  },

  patchTrainingProgram: async ({ locals, request, url, params }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();
    const id = Number(params.id);

    // Validate input fields
    // NOTE: we are sending form data as json object back to be parsed 
    const input = new TrainingProgramFormData(JSON.parse(rawFormData.trainingProgram.toString()));
    const { message, isValid } = input.validate()
    if (!isValid) {
      return fail(401, { message, trainingProgramFormData: rawFormData })
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.update(input, id, user?.userId);
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
  }
}
