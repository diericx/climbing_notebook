import type { Actions } from "./$types";
import { error, fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from "../$types";
import { SERVER_ERROR } from "$lib/helperTypes";
import type { Profile } from "@prisma/client";
import { protectedPage } from "$lib/auth";

export const load = protectedPage((async ({ fetch, url, params }) => {
  const { id } = params;
  const redirectTo = url.searchParams.get("redirectTo");

  const response = await fetch(`/api/profile/${id}`, {
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
}) satisfies PageServerLoad)

export const actions: Actions = {
  edit: async ({ request, fetch, locals }) => {
    // Protected page, safe to assume user exists
    let { user } = await locals.validateUser();

    // Get journalEntry from form data
    const formData = await request.formData();
    const input = Object.fromEntries(formData.entries());
    const { redirectTo } = input;

    const response = await fetch(`/api/profile/${user?.userId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    })
    if (!response.ok) {
      console.error(response.text())
      return fail(response.status, {
        message: SERVER_ERROR,
        userFormData: input,
        redirectTo
      })
    }

    const data = await response.json();

    if (redirectTo && redirectTo != "") {
      throw redirect(303, redirectTo)
    }

    return data;
  },
}
