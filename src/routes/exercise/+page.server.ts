import { exerciseSelects } from '$lib/prismaHelpers/exerciseHelper';
import { prisma } from '$lib/server/prisma';
import { ExerciseRepo } from '$lib/server/repos/exercise';
import { getSessionOrRedirect } from '$lib/utils';
import { exerciseSchema } from '$lib/zodSchemas';
import { Prisma } from '@prisma/client';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const exerciseRepo = new ExerciseRepo(prisma);
  const exercises = await exerciseRepo.getMany({
    select: exerciseSelects.minimal,
  });
  return {
    exercises,
    user,
  };
};

export const actions: Actions = {
  new: async ({ locals, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, zod(exerciseSchema), {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ExerciseRepo(prisma);
    try {
      await repo.new(form.data, user?.userId);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code == 'P2002') {
        return setError(form, 'name', 'An exercise with that name already exists');
      }
      throw e;
    }

    redirect(303, '/exercise');
  },
};
