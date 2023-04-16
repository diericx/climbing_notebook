import type { Actions } from "./$types";
import type { PageServerLoad } from './$types';
import type { ExerciseEvent, Profile } from "@prisma/client";
import { protectedPage } from "$lib/auth";
import { exerciseEventActions } from "$lib/exerciseEvent";

export const load = protectedPage((async ({ fetch, session }) => {
  // Get all exercise events for this user
  let response = await fetch("/api/exerciseEvent", {
    method: "GET",
  })
  let data = await response.json();
  const exerciseEvents: ExerciseEvent[] = data.exercises;

  // Get the user's profile
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
