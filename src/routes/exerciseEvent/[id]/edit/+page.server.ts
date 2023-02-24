import type { Actions } from "./$types";
import { error, fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ExerciseEvent } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";

export const load: PageServerLoad = async ({ locals, fetch, params, url }) => {
  const { id } = params;
  const redirectTo = url.searchParams.get("redirectTo");

  // Protected page
  const session = await locals.validate();
  if (!session) {
    throw redirect(302, "/login?redirectTo=journalEntry")
  }

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
}

export const actions: Actions = {
  edit: async ({ request, fetch, params }) => {
    const { id } = params;

    // Get exerciseEvent from form data
    const formData = await request.formData();
    const input = Object.fromEntries(formData.entries());
    const { redirectTo } = input;

    const response = await fetch(`/api/exerciseEvent/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        exerciseEventFormData: input,
        redirectTo
      })
    }

    if (redirectTo && redirectTo != "") {
      throw redirect(303, redirectTo)
    }

    return data;
  },
}
