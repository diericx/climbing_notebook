import dayjs from '$lib/dayjs';
import { prisma } from '$lib/prisma';
import { trainingProgramActivationSchema, TrainingProgramRepo } from '$lib/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const trainingProgram = await trainingProgramRepo.getOneAndValidateOwner(params.id, user.userId);
  return { trainingProgram };
};

export const actions: Actions = {
  delete: async ({ locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const trainingProgramId = params.id;
    const activationId = params.activationId;

    const repo = new TrainingProgramRepo(prisma);
    const activation = await repo.deleteActivation(trainingProgramId, activationId, user?.userId);

    return { success: true, activation };
  },

  edit: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const activationId = params.activationId;
    const form = await superValidate(formData, trainingProgramActivationSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    if (dayjs(form.data.startDate).day() > 1) {
      return setError(
        form,
        'startDate',
        'Start Date must be on a Monday or Sunday. This is because cycles are structured around a full week.'
      );
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.updateActivation(form.data, activationId, user?.userId);

    return { form };
  },
};
