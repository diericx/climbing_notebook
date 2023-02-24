import type { Actions } from "./$types";
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ExerciseEvent } from "@prisma/client";

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Protected page
  const session = await locals.validate();
  if (!session) {
    throw redirect(302, "/login?redirectTo=climbingJournal")
  }

  const response = await fetch("/api/exerciseEvent", {
    method: "GET",
  })
  const data = await response.json();
  const exerciseEvents: ExerciseEvent[] = data.exercises;

  return {
    exerciseEvents,
  };
}

export const actions: Actions = {
  new: async ({ request, fetch }) => {
    // Get exercise from form data
    const formData = await request.formData();
    const formDataAsObj = Object.fromEntries(formData.entries());

    const response = await fetch("/api/exerciseEvent", {
      method: "POST",
      body: JSON.stringify(formDataAsObj),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        exerciseEventFormData: formDataAsObj
      })
    }

    if (formDataAsObj.redirectTo && formDataAsObj.redirectTo != "") {
      throw redirect(303, formDataAsObj.redirectTo)
    }

    return data;
  },

  delete: async ({ request, fetch }) => {
    const formData = await request.formData();
    const input = Object.fromEntries(formData.entries());

    const response = await fetch(`/api/exerciseEvent/${input.id}`, {
      method: "DELETE",
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
      })
    }

    return data;
  }
}
