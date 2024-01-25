import { ExerciseEventRepo } from '$lib/exerciseEvent';
import { exerciseGroupSchema } from '$lib/exerciseGroup';
import { prisma } from '$lib/prisma';
import { TrainingCycleRepo } from '$lib/trainingCycle';
import { getSessionOrRedirect } from '$lib/utils';
import { exerciseEventSchema } from '$lib/zodSchemas';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const actions: Actions = {
  edit: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const trainingCycleId = Number(params.id);
    const exerciseGroupId = Number(params.groupId);
    const form = await superValidate(formData, exerciseGroupSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingCycleRepo(prisma);
    await repo.editExerciseGroup(form.data, trainingCycleId, exerciseGroupId, user?.userId);

    return { form };
  },

  delete: async ({ locals, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const trainingCycleId = Number(params.id);
    const exerciseGroupId = Number(params.groupId);

    const repo = new TrainingCycleRepo(prisma);
    await repo.deleteExerciseGroup(trainingCycleId, user?.userId, exerciseGroupId);

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

    return { form };
  },
};
