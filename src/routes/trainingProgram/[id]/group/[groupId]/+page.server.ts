import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { APIError } from '$lib/errors';
import { ExerciseGroupFormData } from '$lib/exerciseGroup';

export const actions: Actions = {
  addExerciseGroup: async ({ locals, request, url, params }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();
    const id = Number(params.id);

    // Validate input fields
    // NOTE: we are sending form data as json object back to be parsed 
    const input = new ExerciseGroupFormData(rawFormData);
    const { message, isValid } = input.validate()
    if (!isValid) {
      return fail(401, { message, trainingProgramFormData: rawFormData })
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.addExerciseGroup(input, id, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, exerciseGroupFormData: rawFormData })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },

  editExerciseGroup: async ({ locals, request, url, params }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();
    const trainingProgramId = Number(params.id);
    const exerciseGroupId = Number(params.groupId);

    // Validate input fields
    // NOTE: we are sending form data as json object back to be parsed 
    const input = new ExerciseGroupFormData(rawFormData);
    const { message, isValid } = input.validate()
    if (!isValid) {
      return fail(401, { message, exerciseGroupFormData: rawFormData })
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.editExerciseGroup(input, trainingProgramId, exerciseGroupId, user?.userId);
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

  deleteExerciseGroup: async ({ locals, request, url, params }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();
    const id = Number(params.id);
    const exerciseGroupId = Number(rawFormData.exerciseGroupId);

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.deleteExerciseGroup(id, user?.userId, exerciseGroupId);
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
