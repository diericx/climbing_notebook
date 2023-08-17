import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { APIError } from '$lib/errors';
import { superValidate } from 'sveltekit-superforms/server';
import { exerciseGroupSchema } from '$lib/exerciseGroup';
import { ExerciseEventRepo, exerciseEventSchema } from '$lib/exerciseEvent';

export const actions: Actions = {
  edit: async ({ locals, request, url, params }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validate();
    const trainingProgramId = Number(params.id);
    const exerciseGroupId = Number(params.groupId);
    const form = await superValidate(formData, exerciseGroupSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.editExerciseGroup(form.data, trainingProgramId, exerciseGroupId, user?.userId);
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

  delete: async ({ locals, url, params }) => {
    const { user } = await locals.auth.validate();
    const trainingProgramId = Number(params.id);
    const exerciseGroupId = Number(params.groupId);

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.deleteExerciseGroup(trainingProgramId, user?.userId, exerciseGroupId);
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

    return { success: true };
  },

  newExerciseEvent: async ({ locals, request, url, params }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validate();
    const form = await superValidate(formData, exerciseEventSchema, {
      id: formData.get('_formId')?.toString(),
    });
    const groupId = Number(params.groupId);

    if (!form.valid) {
      return fail(400, { form });
    }

    form.data.exerciseGroupId = groupId;
    const repo = new ExerciseEventRepo(prisma);
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
