import { prisma } from '$lib/prisma';
import { ProfileRepo } from '$lib/profile';
import { TrainingCycleRepo, trainingCycleSchema } from '$lib/trainingCycle';
import { getSessionOrRedirect } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const trainingCycleRepo = new TrainingCycleRepo(prisma);
  const profileRepo = new ProfileRepo(prisma);

  const trainingCycles = await trainingCycleRepo.get(user?.userId, {
    trainingProgramId: null,
  });
  const profile = await profileRepo.getOne(user?.userId);
  return {
    trainingCycles,
    profile,
  };
};

export const actions: Actions = {
  new: async ({ locals, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const form = await superValidate(request, trainingCycleSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingCycleRepo(prisma);
    await repo.new(form.data, user?.userId);

    return { form };
  },
};
