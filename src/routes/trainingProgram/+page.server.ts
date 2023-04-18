import type { Actions } from "./$types";
import type { PageServerLoad } from './$types';
import type { TrainingProgram } from "@prisma/client";
import { trainingProgramActions } from "$lib/trainingProgram";
import type { ProfileWithActiveTrainingProgram } from "$lib/prisma";

export const load: PageServerLoad = async ({ fetch }) => {
  let response = await fetch("/api/trainingProgram", {
    method: "GET",
  })
  let data = await response.json();
  const trainingPrograms: TrainingProgram[] = data.trainingPrograms;

  response = await fetch(`/api/profile`, {
    method: "GET",
  })
  data = await response.json();
  const profile: ProfileWithActiveTrainingProgram = data.profile

  return {
    trainingPrograms,
    profile,
  }
}

export const actions: Actions = {
  ...trainingProgramActions,
}
