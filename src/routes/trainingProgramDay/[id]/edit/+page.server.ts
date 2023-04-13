import type { Actions } from "./$types";
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { TrainingProgramDay } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedPage } from "$lib/auth";
import { trainingProgramDayActions } from "$lib/trainingProgramDay";

export const load = protectedPage((async ({ fetch, params, url }) => {
  const { id } = params;
  const redirectTo = url.searchParams.get("redirectTo");

  const response = await fetch(`/api/trainingProgramDay/${id}`, {
    method: "GET",
  })
  if (!response.ok) {
    throw error(500, { message: SERVER_ERROR })
  }

  const data = await response.json();
  const trainingProgramDay: TrainingProgramDay = data.trainingProgramDay;

  return {
    trainingProgramDay,
    redirectTo
  };
}) satisfies PageServerLoad)

export const actions: Actions = {
  ...trainingProgramDayActions
}
