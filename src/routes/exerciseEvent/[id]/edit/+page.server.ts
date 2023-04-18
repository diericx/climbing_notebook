import type { Actions } from "./$types";
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ExerciseEvent } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { exerciseEventActions } from "$lib/exerciseEvent";

export const load: PageServerLoad = async ({ fetch, params, url }) => {
  const { id } = params;

  const response = await fetch(`/api/exerciseEvent/${id}`, {
    method: "GET",
  })
  if (!response.ok) {
    throw error(500, { message: SERVER_ERROR })
  }

  const data = await response.json();
  const exerciseEvent: ExerciseEvent = data.exerciseEvent;

  return {
    exerciseEvent,
  };
};

export const actions: Actions = {
  ...exerciseEventActions,
}
