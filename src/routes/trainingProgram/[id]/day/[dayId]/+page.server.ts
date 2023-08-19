import { ExerciseEventRepo, exerciseEventSchema } from '$lib/exerciseEvent';
import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { trainingProgramDaySchema } from '$lib/trainingProgramDay';
import { getSessionOrRedirect } from '$lib/utils';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const actions: Actions = {
  connectExerciseGroup: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const trainingProgramId = Number(params.id);
    const trainingProgramDayId = Number(params.dayId);
    const exerciseGroupId = Number(rawFormData.exerciseGroupId);
    if (isNaN(exerciseGroupId)) {
      return fail(401, { message: 'Invalid exercise group', trainingProgramFormData: rawFormData });
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.connectExerciseGroupToDay(
      trainingProgramId,
      exerciseGroupId,
      trainingProgramDayId,
      user?.userId
    );

    return { success: true };
  },

  disconnectExerciseGroup: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const trainingProgramId = Number(params.id);
    const trainingProgramDayId = Number(params.dayId);
    const exerciseGroupId = Number(rawFormData.exerciseGroupId);
    if (isNaN(exerciseGroupId)) {
      return fail(401, { message: 'Invalid exercise group', trainingProgramFormData: rawFormData });
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.disconnectExerciseGroupFromDay(
      trainingProgramId,
      exerciseGroupId,
      trainingProgramDayId,
      user?.userId
    );

    return { success: true };
  },

  edit: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const form = await superValidate(formData, trainingProgramDaySchema, {
      id: formData.get('_formId')?.toString(),
    });
    const trainingProgramId = Number(params.id);
    const trainingProgramDayId = Number(params.dayId);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.editTrainingProgramDay(
      form.data,
      trainingProgramId,
      trainingProgramDayId,
      user?.userId
    );

    return { form };
  },

  newExerciseEvent: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const dayId = params.dayId;
    const form = await superValidate(formData, exerciseEventSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    form.data.trainingProgramDayId = Number(dayId);
    const exerciseEventRepo = new ExerciseEventRepo(prisma);
    await exerciseEventRepo.new(form.data, user?.userId);

    return { form };
  },
};
