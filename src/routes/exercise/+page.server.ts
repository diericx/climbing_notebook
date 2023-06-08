import { ExerciseRepo, exerciseSchema } from '$lib/exercise';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { error, fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const exerciseRepo = new ExerciseRepo(prisma);
  try {
    const exercises = await exerciseRepo.get();
    return {
      exercises
    };
  } catch (e) {
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }
};

export const actions: Actions = {
  new: async ({ locals, request, url }) => {
    const formData = await request.formData();
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(formData, exerciseSchema, {
      id: formData.get('_formId')?.toString(),
    });

    if (!form.valid) {
      return fail(400, { form });
    }

    console.log('success: ', form.data)

    // const repo = new ExerciseEventRepo(prisma);
    // try {
    //   await repo.new(form.data, user?.userId)
    // } catch (e) {
    //   if (e instanceof APIError) {
    //     return fail(401, { message: e.detail, form })
    //   }
    //   console.error(e)
    //   throw error(500, { message: SERVER_ERROR })
    // }
    //
    // const exerciseToMarkCompletedId = formData.get('exerciseToMarkCompletedId');
    // const dateToMarkCompleted = formData.get('dateToMarkCompleted');
    // if (exerciseToMarkCompletedId != null && dateToMarkCompleted != null) {
    //   await repo.setCompleted(Number(exerciseToMarkCompletedId), user?.userId, new Date(dateToMarkCompleted.toString()), true)
    // }
    //
    // if (url.searchParams.has('redirectTo')) {
    //   throw redirect(303, url.searchParams.get('redirectTo') || '/');
    // }

    return { form };
  }
}
