import type { Actions } from "./$types";
import { error, fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { TrainingProgramDay } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedPage } from "$lib/auth";

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
