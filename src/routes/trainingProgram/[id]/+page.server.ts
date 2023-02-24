import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SERVER_ERROR } from "$lib/helperTypes";
import type { TrainingProgramFormData } from "$lib/trainingProgram";
import { protectedPage } from '$lib/auth';

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

  return {
    trainingProgram,
    redirectTo
  };
}) satisfies PageServerLoad)

