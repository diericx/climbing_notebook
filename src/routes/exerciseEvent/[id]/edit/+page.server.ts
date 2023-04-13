import type { Actions } from "./$types";
import { error, fail, type Action } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ExerciseEvent } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedPage } from "$lib/auth";
import { enhancedFormAction } from "$lib/utils";
import { exerciseEventActions } from "$lib/exerciseEvent";

export const load = protectedPage((async ({ fetch, params, url }) => {
  const { id } = params;
  const redirectTo = url.searchParams.get("redirectTo");

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
    redirectTo
  };
}) satisfies PageServerLoad)

export const actions: Actions = {
  ...exerciseEventActions,
}
