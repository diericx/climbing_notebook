import { prisma } from '$lib/prisma';
import { ProfileRepo } from '$lib/profile';
import {
  trainingProgramActivationSchema,
  TrainingProgramRepo,
  trainingProgramSchema,
} from '$lib/trainingProgram';
import { getSessionOrRedirect } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const trainingProgramRepo = new TrainingProgramRepo(prisma);
  const profileRepo = new ProfileRepo(prisma);

  const trainingPrograms = await trainingProgramRepo.get(user?.userId);
  const profile = await profileRepo.getOne(user?.userId);
  return {
    trainingPrograms,
    profile,
  };
};

export const actions: Actions = {
  new: async ({ locals, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const form = await superValidate(request, trainingProgramSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.new(form.data, user?.userId);

    return { form };
  },

  newActivation: async ({ locals, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });
    const form = await superValidate(request, trainingProgramActivationSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    if (dayjs(form.data.startDate).day() > 1) {
      return setError(form, 'startDate', 'Start Date must be on a Monday or Sunday');
    }

    const repo = new TrainingProgramRepo(prisma);
    await repo.newActivation(form.data, user?.userId);

    return { form };
  },
};
