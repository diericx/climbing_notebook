import type { Actions } from "./$types";
import type { PageServerLoad } from './$types';
import type { Profile, TrainingProgram } from "@prisma/client";
import { trainingProgramActions } from "$lib/trainingProgram";
import { profileActions } from "$lib/profile";

export const load: PageServerLoad = async ({ fetch, locals }) => {
  const { session } = locals;

  let response = await fetch("/api/trainingProgram", {
    method: "GET",
  })
  let data = await response.json();
  const trainingPrograms: TrainingProgram[] = data.trainingPrograms;

  response = await fetch(`/api/profile/${session!.userId}`, {
    method: "GET",
  })
  data = await response.json();
  const profile: Profile = data.profile

  return {
    trainingPrograms,
    profile,
  }
}

export const actions: Actions = {
  ...trainingProgramActions,
  ...profileActions
}
