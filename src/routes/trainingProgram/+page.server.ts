import type { Actions } from "./$types";
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Profile, TrainingProgram } from "@prisma/client";
import { protectedPage } from "$lib/auth";

export const load = protectedPage((async ({ fetch, session }) => {
  let response = await fetch("/api/trainingProgram", {
    method: "GET",
  })
  let data = await response.json();
  const trainingPrograms: TrainingProgram[] = data.trainingPrograms;

  response = await fetch(`/api/profile/${session.userId}`, {
    method: "GET",
  })
  data = await response.json();
  const profile: Profile = data.profile

  return {
    trainingPrograms,
    profile,
  }
}) satisfies PageServerLoad)

export const actions: Actions = {
  new: async ({ request, fetch }) => {
    // Get exercise from form data
    const formData = await request.formData();
    const formDataAsObj = Object.fromEntries(formData.entries());

    const response = await fetch("/api/trainingProgram", {
      method: "POST",
      body: JSON.stringify(formDataAsObj),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        trainingProgramFormData: formDataAsObj
      })
    }
    return data;
  },

  delete: async ({ request, fetch }) => {
    const formData = await request.formData();
    const input = Object.fromEntries(formData.entries());

    const response = await fetch(`/api/trainingProgram/${input.id}`, {
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
