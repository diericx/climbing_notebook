
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { APIError } from '$lib/errors';
import { TrainingProgramDayFormData } from '$lib/trainingProgramDay';

export const actions: Actions = {
  connectExerciseGroup: async ({ locals, request, url, params }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();
    const trainingProgramId = Number(params.id);
    const trainingProgramDayId = Number(params.dayId);
    const exerciseGroupId = Number(rawFormData.exerciseGroupId);
    if (isNaN(exerciseGroupId)) {
      return fail(401, { message: 'Invalid exercise group', trainingProgramFormData: rawFormData })
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.connectExerciseGroupToDay(trainingProgramId, exerciseGroupId, trainingProgramDayId, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, trainingProgramFormData: rawFormData })
      }
      console.error(e)
      return fail(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },

  disconnectExerciseGroup: async ({ locals, request, url, params }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();
    const trainingProgramId = Number(params.id);
    const trainingProgramDayId = Number(params.dayId);
    const exerciseGroupId = Number(rawFormData.exerciseGroupId);
    if (isNaN(exerciseGroupId)) {
      return fail(401, { message: 'Invalid exercise group', trainingProgramFormData: rawFormData })
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.disconnectExerciseGroupFromDay(trainingProgramId, exerciseGroupId, trainingProgramDayId, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, trainingProgramFormData: rawFormData })
      }
      console.error(e)
      return fail(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },

  editTrainingProgramDay: async ({ locals, request, url, params }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();
    const trainingProgramId = Number(params.id);
    const trainingProgramDayId = Number(params.dayId);

    const input = new TrainingProgramDayFormData(rawFormData);

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.editTrainingProgramDay(input, trainingProgramId, trainingProgramDayId, user?.userId);
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, trainingProgramFormData: rawFormData })
      }
      console.error(e)
      return fail(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },
}
