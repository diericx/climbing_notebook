import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { APIError } from '$lib/errors';
import { superValidate } from 'sveltekit-superforms/server';
import { trainingProgramDaySchema } from '$lib/trainingProgramDay';
import { ExerciseEventRepo, exerciseEventSchema } from '$lib/exerciseEvent';

export const actions: Actions = {
  connectExerciseGroup: async ({ locals, request, url, params }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();
    const trainingProgramId = Number(params.id);
    const trainingProgramDayId = Number(params.dayId);
    const exerciseGroupId = Number(rawFormData.exerciseGroupId);
    if (isNaN(exerciseGroupId)) {
      return fail(401, { message: 'Invalid exercise group', trainingProgramFormData: rawFormData });
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.connectExerciseGroupToDay(
        trainingProgramId,
        exerciseGroupId,
        trainingProgramDayId,
        user?.userId
      );
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, trainingProgramFormData: rawFormData });
      }
      console.error(e);
      return fail(500, { message: SERVER_ERROR });
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
      return fail(401, { message: 'Invalid exercise group', trainingProgramFormData: rawFormData });
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.disconnectExerciseGroupFromDay(
        trainingProgramId,
        exerciseGroupId,
        trainingProgramDayId,
        user?.userId
      );
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, trainingProgramFormData: rawFormData });
      }
      console.error(e);
      return fail(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },

  edit: async ({ locals, request, url, params }) => {
    const formData = await request.formData();
    const form = await superValidate(formData, trainingProgramDaySchema, {
      id: formData.get('_formId')?.toString(),
    });
    const { user } = await locals.auth.validateUser();
    const trainingProgramId = Number(params.id);
    const trainingProgramDayId = Number(params.dayId);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.editTrainingProgramDay(
        form.data,
        trainingProgramId,
        trainingProgramDayId,
        user?.userId
      );
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, form });
      }
      console.error(e);
      return fail(500, { message: SERVER_ERROR, form });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },

  newExerciseEvent: async ({ locals, request, url, params }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const dayId = params.dayId;
    const form = await superValidate(formData, exerciseEventSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    form.data.trainingProgramDayId = Number(dayId);
    const exerciseEventRepo = new ExerciseEventRepo(prisma);
    try {
      await exerciseEventRepo.new(form.data, user?.userId);
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
