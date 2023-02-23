import type { Actions } from "./$types";
import { error, fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SERVER_ERROR } from "$lib/helperTypes";
import type { TrainingProgramFormData } from "$lib/trainingProgram";

export const load: PageServerLoad = async ({ locals, fetch, params, url }) => {
  const { id } = params;
  const redirectTo = url.searchParams.get("redirectTo");

  // Protected page
  const session = await locals.validate();
  if (!session) {
    throw redirect(302, "/login?redirectTo=climbingJournal")
  }

  const response = await fetch(`/api/trainingProgram/${id}`, {
    method: "GET",
  })
  if (!response.ok) {
    throw error(500, { message: SERVER_ERROR })
  }

  const data = await response.json();
  const trainingProgram: TrainingProgramFormData = data.trainingProgram;
  console.log(trainingProgram)

  return {
    trainingProgram,
    redirectTo
  };
}

