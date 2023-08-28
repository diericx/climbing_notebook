import { prisma } from '$lib/prisma';
import { TrainingProgramRepo } from '$lib/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import { fail } from '@sveltejs/kit';
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
