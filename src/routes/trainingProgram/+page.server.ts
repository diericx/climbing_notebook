import type { Actions } from "./$types";
import type { PageServerLoad } from './$types';
import type { Profile, TrainingProgram } from "@prisma/client";
import { protectedPage } from "$lib/auth";
import { trainingProgramActions } from "$lib/trainingProgram";
import { profileActions } from "$lib/profile";

export const load = protectedPage((async ({ fetch, session }) => {
  let response = await fetch("/api/trainingProgram", {
    method: "GET",
  })
  let data = await response.json();
  const trainingPrograms: TrainingProgram[] = data.trainingPrograms;

  response = await fetch(`/api/profile/${session.userId}`, {
    method: "GET",
  })
  data = await response.json();
  const profile: Profile = data.profile

  return {
    trainingPrograms,
    profile,
  }
}) satisfies PageServerLoad)

export const actions: Actions = {
  ...trainingProgramActions,
  ...profileActions
}
