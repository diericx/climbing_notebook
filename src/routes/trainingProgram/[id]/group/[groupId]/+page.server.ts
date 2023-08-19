import { fail, redirect, type Actions } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { superValidate } from 'sveltekit-superforms/server';
import { exerciseGroupSchema } from '$lib/exerciseGroup';
import { ExerciseEventRepo, exerciseEventSchema } from '$lib/exerciseEvent';
import { getSessionOrRedirect } from '$lib/utils';

export const actions: Actions = {
  edit: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const trainingProgramId = Number(params.id);
    const exerciseGroupId = Number(params.groupId);
    const form = await superValidate(formData, exerciseGroupSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.editExerciseGroup(form.data, trainingProgramId, exerciseGroupId, user?.userId);

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },

  delete: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const trainingProgramId = Number(params.id);
    const exerciseGroupId = Number(params.groupId);

    const repo = new TrainingProgramRepo(prisma);
    await repo.deleteExerciseGroup(trainingProgramId, user?.userId, exerciseGroupId);

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },

  newExerciseEvent: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const form = await superValidate(formData, exerciseEventSchema, {
      id: formData.get('_formId')?.toString(),
    });
    const groupId = Number(params.groupId);

    if (!form.valid) {
      return fail(400, { form });
    }

    form.data.exerciseGroupId = groupId;
    const repo = new ExerciseEventRepo(prisma);
    await repo.new(form.data, user?.userId);

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },
};
