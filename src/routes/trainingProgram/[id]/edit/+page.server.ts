import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SERVER_ERROR } from "$lib/helperTypes";
import { trainingProgramActions } from "$lib/trainingProgram";
import { exerciseEventActions } from '$lib/exerciseEvent';
import type { TrainingProgramWithDays } from '$lib/prisma';

export const load: PageServerLoad = async ({ fetch, params, url }) => {
  const { id } = params;
  const redirectTo = url.searchParams.get("redirectTo");

  const response = await fetch(`/api/trainingProgram/${id}`, {
    method: "GET",
  })
  if (!response.ok) {
    throw error(500, { message: SERVER_ERROR })
  }

  const data = await response.json();
  const trainingProgram: TrainingProgramWithDays = data.trainingProgram;
  let trainingProgramOriginal = JSON.parse(JSON.stringify(trainingProgram));

  return {
    trainingProgram,
    trainingProgramOriginal,
    redirectTo
  };
};

export const actions: Actions = {
  ...exerciseEventActions,
  ...trainingProgramActions
}
