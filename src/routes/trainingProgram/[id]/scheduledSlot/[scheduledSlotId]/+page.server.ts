import { prisma } from '$lib/server/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import { trainingProgramScheduledSlotSchema } from '$lib/zodSchemas';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/client';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const trainingProgram = await trainingProgramRepo.getOne({
    id: params.id,
    userId: user.userId,
    select: TrainingProgramRepo.selectMinimal,
  });
  return { trainingProgram };
};

export const actions: Actions = {
  update: async ({ locals, request, url, params }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const formData = await request.formData();
    const form = await superValidate(formData, trainingProgramScheduledSlotSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.updateTrainingProgramScheduledSlot(
      form.data,
      params.id,
      params.scheduledSlotId,
      user?.userId
    );

    return { form };
  },

  delete: async ({ locals, params, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const trainingProgramId = params.id;
    const slotId = params.scheduledSlotId;

    const repo = new TrainingProgramRepo(prisma);
    await repo.deleteTrainingProgramScheduledSlot(trainingProgramId, slotId, user?.userId);

    return { success: true };
  },

  move: async ({ locals, params, url, request }) => {
    const formData = await request.formData();
    const { user } = await getSessionOrRedirect({ locals, url });
    const trainingProgramId = params.id;
    const slotId = params.scheduledSlotId;
    const order = formData.get('order');
    if (order == null) {
      return fail(400);
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.moveTrainingProgramScheduledSlot(
      trainingProgramId,
      slotId,
      Number(order),
      user?.userId
    );

    return { success: true };
  },
};
