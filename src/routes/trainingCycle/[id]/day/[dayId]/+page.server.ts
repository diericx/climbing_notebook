import { prisma } from '$lib/server/prisma';
import { ExerciseEventRepo } from '$lib/server/repos/exerciseEventRepo';
import { TrainingCycleRepo } from '$lib/server/repos/trainingCycleRepo';
import { getSessionOrRedirect } from '$lib/utils';
import { exerciseEventSchema, trainingCycleDaySchema } from '$lib/zodSchemas';
import { fail, type Actions } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

export const actions: Actions = {
  connectExerciseGroup: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const trainingCycleId = Number(params.id);
    const trainingCycleDayId = Number(params.dayId);
    const exerciseGroupId = Number(rawFormData.exerciseGroupId);
    if (isNaN(exerciseGroupId)) {
      return fail(401, { message: 'Invalid exercise group', trainingCycleFormData: rawFormData });
    }

    const repo = new TrainingCycleRepo(prisma);
    await repo.connectExerciseGroupToDay(
      trainingCycleId,
      exerciseGroupId,
      trainingCycleDayId,
      user?.userId
    );

    return {};
  },

  disconnectExerciseGroup: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const trainingCycleId = Number(params.id);
    const trainingCycleDayId = Number(params.dayId);
    const exerciseGroupId = Number(rawFormData.exerciseGroupId);
    if (isNaN(exerciseGroupId)) {
      return fail(401, { message: 'Invalid exercise group', trainingCycleFormData: rawFormData });
    }

    const repo = new TrainingCycleRepo(prisma);
    await repo.disconnectExerciseGroupFromDay(
      trainingCycleId,
      exerciseGroupId,
      trainingCycleDayId,
      user?.userId
    );

    return {};
  },

  edit: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const form = await superValidate(formData, zod(trainingCycleDaySchema), {
      id: formData.get('_formId')?.toString(),
    });
    const trainingCycleId = Number(params.id);
    const trainingCycleDayId = Number(params.dayId);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingCycleRepo(prisma);
    await repo.editTrainingCycleDay(form.data, trainingCycleId, trainingCycleDayId, user?.userId);

    return { form };
  },

  newExerciseEvent: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const dayId = params.dayId;
    const form = await superValidate(formData, zod(exerciseEventSchema), {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    form.data.trainingCycleDayId = Number(dayId);
    const exerciseEventRepo = new ExerciseEventRepo(prisma);
    await exerciseEventRepo.new(form.data, user?.userId);

    return { form };
  },
};
