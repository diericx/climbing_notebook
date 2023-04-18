import type { Actions } from "./$types";
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from "../$types";
import { SERVER_ERROR } from "$lib/helperTypes";
import type { Profile } from "@prisma/client";

export const load: PageServerLoad = async ({ fetch, url, params }) => {
  const { id } = params;
  const redirectTo = url.searchParams.get("redirectTo");

  const response = await fetch(`/api/profile`, {
    method: "GET",
  })
  if (!response.ok) {
    if (response.status == 404) {
      throw error(404, { message: "Profile not found" })
    }
    console.error(response.status, response.text())
    throw error(500, { message: SERVER_ERROR })
  }

  const data = await response.json();
  const profile: Profile = data.profile;

  return {
    profile,
    redirectTo
  };
};

export const actions: Actions = {
  editProfile: async ({ fetch, request, url }) => {
    const formData = Object.fromEntries((await request.formData()).entries());

    const response = await fetch(`/api/profile`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    })
    const data = await response.json();

    if (!response.ok) {
      console.error(response.text())
      return fail(response.status, {
        message: SERVER_ERROR,
        userFormData: formData,
      })
    }


    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return data;
  }
}
