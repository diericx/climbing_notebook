import type { Actions } from "./$types";
import type { PageServerLoad } from './$types';
import type { Profile } from "@prisma/client";
import { prisma } from "$lib/prisma";
import { error, fail, redirect } from "@sveltejs/kit";
import { APIError } from "$lib/errors";
import { SERVER_ERROR } from "$lib/helperTypes";
import { ExerciseEventFormData, ExerciseEventRepo } from "$lib/exerciseEvent";
import { ProfileRepo } from "$lib/profile";

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.auth.validateUser();
  const exerciseEventsRepo = new ExerciseEventRepo(prisma);
  let exerciseEvents;
  try {
    exerciseEvents = await exerciseEventsRepo.get(Number(user?.userId));
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  // Get the user's profile
  const profileRepo = new ProfileRepo(prisma);
  let profile: Profile;
  try {
    profile = await profileRepo.getOne(Number(user?.userId));
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  return {
    exerciseEvents,
    profile,
  };
};


export const actions: Actions = {
  newExerciseEvent: async ({ locals, request, url }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();

    // Validate input fields
    const input = new ExerciseEventFormData(rawFormData);
    let { message, isValid } = input.validate()
    if (!isValid) {
      return fail(401, { message, exerciseEventFormData: rawFormData })
    }

    const repo = new ExerciseEventRepo(prisma);
    try {
      await repo.new(input, Number(user?.userId))
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, exerciseEventFormData: rawFormData })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  }
}
