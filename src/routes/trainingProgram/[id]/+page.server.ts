import { APIError } from '$lib/errors';
import { exerciseGroupSchema } from '$lib/exerciseGroup';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo, trainingProgramSchema } from '$lib/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import type { TrainingProgram } from '@prisma/client';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
  const session = await locals.auth.validate();

  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const trainingProgram = await trainingProgramRepo.getOne(Number(params.id));
  // If no user is not signed in and the training program is not public, error out
  if (!trainingProgram.isPublic && session === null) {
    throw new APIError('INVALID_PERMISSIONS', 'This Training Program is private');
  }
  return { trainingProgram, session };
};

export const actions: Actions = {
  delete: async ({ locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const id = Number(params.id);

    const repo = new TrainingProgramRepo(prisma);
    let trainingProgram: TrainingProgram;
    trainingProgram = await repo.delete(id, user?.userId);

    return { success: true, trainingProgram };
  },

  duplicate: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    if (!user) {
      throw redirect(302, '/login?redirectTo=' + url.toString());
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.duplicate(Number(params.id), user?.userId);

    return { success: true };
  },

  edit: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const id = Number(params.id);
    const form = await superValidate(formData, trainingProgramSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.update(form.data, id, user?.userId);

    return { form };
  },

  addExerciseGroup: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const id = Number(params.id);
    const form = await superValidate(formData, exerciseGroupSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.addExerciseGroup(form.data, id, user?.userId);

    return { form };
  },

  deleteExerciseGroup: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const id = Number(params.id);
    const exerciseGroupId = Number(rawFormData.exerciseGroupId);

    const repo = new TrainingProgramRepo(prisma);
    await repo.deleteExerciseGroup(id, user?.userId, exerciseGroupId);

    return { success: true };
  },
};
