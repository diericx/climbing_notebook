import type { Actions } from "./$types";
import { error, fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ExerciseEvent, TrainingProgramDay } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";

export const load: PageServerLoad = async ({ locals, fetch, params, url }) => {
  const { id } = params;
  const redirectTo = url.searchParams.get("redirectTo");

  // Protected page
  const session = await locals.validate();
  if (!session) {
    throw redirect(302, `/login?redirectTo=trainingProgramDay/${id}/edit`)
  }

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
}

export const actions: Actions = {
  edit: async ({ request, fetch, params }) => {
    const { id } = params;

    // Get from form data
    const formData = await request.formData();
    const input = Object.fromEntries(formData.entries());
    const { redirectTo } = input;

    const response = await fetch(`/api/trainingProgramDay/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        trainingProgramDayFormData: input,
        redirectTo
      })
    }

    if (redirectTo && redirectTo != '') {
      throw redirect(303, redirectTo)
    }

    return data;
  },
}
