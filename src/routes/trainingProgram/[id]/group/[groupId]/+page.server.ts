import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { APIError } from '$lib/errors';
import { superValidate } from 'sveltekit-superforms/server';
import { exerciseGroupSchema } from '$lib/exerciseGroup';

export const actions: Actions = {
  editExerciseGroup: async ({ locals, request, url, params }) => {
    const { user } = await locals.auth.validateUser();
    const trainingProgramId = Number(params.id);
    const exerciseGroupId = Number(params.groupId);
    const form = await superValidate(request, exerciseGroupSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.editExerciseGroup(form.data, trainingProgramId, exerciseGroupId, user?.userId);
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

  deleteExerciseGroup: async ({ locals, url, params }) => {
    const { user } = await locals.auth.validateUser();
    const trainingProgramId = Number(params.id);
    const exerciseGroupId = Number(params.groupId);

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.deleteExerciseGroup(trainingProgramId, user?.userId, exerciseGroupId);
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

    return { success: true };
  },
}
