import type { Actions } from "./$types";
import { fail, type Action } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ExerciseEvent, Profile } from "@prisma/client";
import { protectedPage } from "$lib/auth";
import { enhancedFormAction } from "$lib/utils";
import { exerciseEventActions } from "$lib/exerciseEvent";

export const load = protectedPage((async ({ fetch, session }) => {
  let response = await fetch("/api/exerciseEvent", {
    method: "GET",
  })
  let data = await response.json();
  const exerciseEvents: ExerciseEvent[] = data.exercises;

  response = await fetch(`/api/profile/${session.userId}`, {
    method: "GET",
  })
  data = await response.json();
  const profile: Profile = data.profile

  return {
    exerciseEvents,
    profile,
  };
}) satisfies PageServerLoad)


export const actions: Actions = {
  ...exerciseEventActions
}
