import type { Actions } from "./$types";
import { fail, type Action } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ExerciseEvent, Profile } from "@prisma/client";
import { protectedPage } from "$lib/auth";
import { enhancedFormAction } from "$lib/utils";

export const load = protectedPage((async ({ fetch, session }) => {
  let response = await fetch("/api/exerciseEvent", {
    method: "GET",
  })
  let data = await response.json();
  const exerciseEvents: ExerciseEvent[] = data.exercises;

  response = await fetch(`/api/profile/${session.userId}`, {
    method: "GET",
  })
  data = await response.json();
  const profile: Profile = data.profile

  return {
    exerciseEvents,
    profile,
  };
}) satisfies PageServerLoad)


export const actions: Actions = {
  new: enhancedFormAction((async ({ fetch, formData }) => {
    const response = await fetch("/api/exerciseEvent", {
      method: "POST",
      body: JSON.stringify(formData),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        exerciseEventFormData: formData
      })
    }

    return data;
  }) satisfies Action),

  delete: enhancedFormAction((async ({ fetch, formData }) => {
    const response = await fetch(`/api/exerciseEvent/${formData.id}`, {
      method: "DELETE",
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
      })
    }

    return data;
  }) satisfies Action)
}
