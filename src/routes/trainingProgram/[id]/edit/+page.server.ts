import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo, trainingProgramSchema } from '$lib/trainingProgram';
import { APIError } from '$lib/errors';
import type { TrainingProgram } from '@prisma/client';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validateUser();
  const id = Number(params.id);

  try {
    const repo = new TrainingProgramRepo(prisma);
    const trainingProgram = await repo.getOne(Number(id), user?.userId);

    return {
      trainingProgram,
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

  editTrainingProgram: async ({ locals, request, url, params }) => {
    const { user } = await locals.auth.validateUser();
    const id = Number(params.id);
    const form = await superValidate(request, trainingProgramSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.update(form.data, id, user?.userId);
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

  addExerciseGroup: async ({ locals, request, url, params }) => {
    const { user } = await locals.auth.validateUser();
    const id = Number(params.id);
    const form = await superValidate(request, trainingProgramSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.addExerciseGroup(form.data, id, user?.userId);
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
