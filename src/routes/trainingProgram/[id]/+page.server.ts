import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo, trainingProgramSchema } from '$lib/trainingProgram';
import { APIError } from '$lib/errors';
import type { TrainingProgram } from '@prisma/client';
import { superValidate } from 'sveltekit-superforms/server';
import { exerciseGroupSchema } from '$lib/exerciseGroup';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validateUser();

  try {
    const trainingProgramRepo = new TrainingProgramRepo(prisma);
    const trainingProgram = await trainingProgramRepo.getOne(Number(params.id), user?.userId);
    if (!trainingProgram.isPublic && !user) {
      throw error(403, 'Unauthorized');
    }
    return { trainingProgram, user };
  } catch (e) {
    if (e instanceof APIError) {
      throw error(401, e.detail);
    }
    console.error(e);
    throw error(500, { message: SERVER_ERROR });
  }
};

export const actions: Actions = {
  delete: async ({ locals, params, url }) => {
    const { user } = await locals.auth.validateUser();
    const id = Number(params.id);

    const repo = new TrainingProgramRepo(prisma);
    let trainingProgram: TrainingProgram;
    try {
      trainingProgram = await repo.delete(id, user?.userId);
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

    return { success: true, trainingProgram };
  },

  duplicate: async ({ locals, url, params }) => {
    const { user } = await locals.auth.validateUser();
    if (!user) {
      throw redirect(302, '/login?redirectTo=' + url.toString());
    }

    const repo = new TrainingProgramRepo(prisma);
    let trainingProgram: TrainingProgram;
    try {
      trainingProgram = await repo.duplicate(Number(params.id), user?.userId);
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

    return { success: true, trainingProgram };
  },

  edit: async ({ locals, request, url, params }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const id = Number(params.id);
    const form = await superValidate(formData, trainingProgramSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.update(form.data, id, user?.userId);
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

  addExerciseGroup: async ({ locals, request, url, params }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const id = Number(params.id);
    const form = await superValidate(formData, exerciseGroupSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    try {
      await repo.addExerciseGroup(form.data, id, user?.userId);
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
        return fail(401, { message: e.detail, trainingProgramFormData: rawFormData });
      }
      console.error(e);
      throw error(500, { message: SERVER_ERROR });
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },
};
