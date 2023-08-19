import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { ProfileRepo } from '$lib/profile';
import { TrainingProgramRepo, trainingProgramSchema } from '$lib/trainingProgram';
import { superValidate } from 'sveltekit-superforms/server';
import { getSessionOrRedirect } from '$lib/utils';

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

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  },
};
