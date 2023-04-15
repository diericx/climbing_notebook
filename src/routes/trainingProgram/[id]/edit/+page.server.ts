import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SERVER_ERROR } from "$lib/helperTypes";
import { trainingProgramActions, type TrainingProgramFormData } from "$lib/trainingProgram";
import { protectedPage } from '$lib/auth';
import { exerciseEventActions } from '$lib/exerciseEvent';
import { exerciseGroupActions } from '$lib/exerciseGroup';

export const load = protectedPage((async ({ fetch, params, url }) => {
  const { id } = params;
  const redirectTo = url.searchParams.get("redirectTo");

  const response = await fetch(`/api/trainingProgram/${id}`, {
    method: "GET",
  })
  if (!response.ok) {
    throw error(500, { message: SERVER_ERROR })
  }

  const data = await response.json();
  const trainingProgram: TrainingProgramFormData = data.trainingProgram;
  let trainingProgramOriginal = JSON.parse(JSON.stringify(trainingProgram));

  return {
    trainingProgram,
    trainingProgramOriginal,
    redirectTo
  };
}) satisfies PageServerLoad)

export const actions: Actions = {
  ...exerciseEventActions,
  ...exerciseGroupActions,
  ...trainingProgramActions
}
