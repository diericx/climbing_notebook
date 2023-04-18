import type { Actions } from "./$types";
import type { PageServerLoad } from './$types';
import type { ExerciseEvent } from "@prisma/client";
import { exerciseEventActions } from "$lib/exerciseEvent";
import type { ProfileWithActiveTrainingProgram } from "$lib/prisma";

export const load: PageServerLoad = async ({ fetch }) => {
  // Get all exercise events for this user
  let response = await fetch("/api/exerciseEvent", {
    method: "GET",
  })
  let data = await response.json();
  const exerciseEvents: ExerciseEvent[] = data.exercises;

  // Get the user's profile
  response = await fetch(`/api/profile`, {
    method: "GET",
  })
  data = await response.json();
  const profile: ProfileWithActiveTrainingProgram = data.profile

  return {
    exerciseEvents,
    profile,
  };
};


export const actions: Actions = {
  ...exerciseEventActions
}
