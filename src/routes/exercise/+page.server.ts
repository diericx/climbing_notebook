import { APIError } from '$lib/errors';
import { ExerciseRepo, exerciseSchema } from '$lib/exercise';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { Prisma } from '@prisma/client';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { getSessionOrRedirect } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const exerciseRepo = new ExerciseRepo(prisma);
  const exercises = await exerciseRepo.get();
  return {
    exercises,
    user,
  };
};

export const actions: Actions = {
  new: async ({ locals, request, url }) => {
    const { user } = await getSessionOrRedirect({ locals, url });

    const formData = await request.formData();
    const form = await superValidate(formData, exerciseSchema, {
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

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }
    throw redirect(303, '/exercise');
  },
};
