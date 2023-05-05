import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { prisma, type ProfileWithActiveTrainingProgram } from '$lib/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { ExerciseEventRepo, exerciseEventSchema } from '$lib/exerciseEvent';
import { ProfileRepo } from '$lib/profile';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.auth.validateUser();
  const exerciseEventsRepo = new ExerciseEventRepo(prisma);
  let exerciseEvents;
  try {
    exerciseEvents = await exerciseEventsRepo.get(user?.userId);
  } catch (e) {
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  // Get the user's profile
  const profileRepo = new ProfileRepo(prisma);
  let profile: ProfileWithActiveTrainingProgram;
  try {
    profile = await profileRepo.getOne(user?.userId);
  } catch (e) {
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  console.log(exerciseEventSchema.parse({}))
  // const newExerciseEventForm = await superValidate(exerciseEventSchema);
  // // Create edit forms for each existing exercise
  // const exerciseEventForms = await Promise.all(exerciseEvents.map(e => {
  //   return superValidate(e, exerciseEventSchema, {
  //     id: e.id.toString()
  //   });
  // }));
  // // Create forms for each exercise in the training program
  // const trainingProgramExerciseEventForms: Validation<ExerciseEventSchema>[] = [];
  // if (profile.activeTrainingProgram != undefined) {
  //   profile.activeTrainingProgram.days.map(async (d) => {
  //     d.exercises.map(async (e) => {
  //       trainingProgramExerciseEventForms.push(await superValidate({ ...e, date: new Date() }, exerciseEventSchema, { id: e.id.toString() }));
  //     });
  //   });
  // }

  return {
    exerciseEvents,
    // newExerciseEventForm,
    // exerciseEventForms,
    // trainingProgramExerciseEventForms,
    profile,
  };
};


export const actions: Actions = {
  newExerciseEvent: async ({ locals, request, url }) => {
    const { user } = await locals.auth.validateUser();
    const form = await superValidate(request, exerciseEventSchema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const repo = new ExerciseEventRepo(prisma);
    try {
      await repo.new(form.data, user?.userId)
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, form })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    const exerciseToMarkCompletedId = url.searchParams.get('exerciseToMarkCompletedId');
    const dateToMarkCompleted = url.searchParams.get('dateToMarkCompleted');
    if (exerciseToMarkCompletedId != null && dateToMarkCompleted != null) {
      await repo.setCompleted(Number(exerciseToMarkCompletedId), user?.userId, new Date(dateToMarkCompleted), true)
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { form };
  }
}
