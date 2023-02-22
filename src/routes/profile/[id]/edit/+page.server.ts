import type { Actions } from "./$types";
import { error, fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from "../$types";
import { SERVER_ERROR } from "$lib/helperTypes";
import type { Profile } from "@prisma/client";

export const load: PageServerLoad = async ({ params, locals, fetch, url }) => {
  const { id } = params;
  const redirectTo = url.searchParams.get("redirectTo");

  // Protected page
  const session = await locals.validate();
  if (!session) {
    throw redirect(302, "/login?redirectTo=climbingJournal")
  }

  const response = await fetch(`/api/profile/${id}`, {
    method: "GET",
  })
  if (!response.ok) {
    if (response.status == 404) {
      throw error(404, { message: "Profile not found" })
    }
    throw error(500, { message: SERVER_ERROR })
  }

  const data = await response.json();
  const profile: Profile = data.profile;

  return {
    profile,
    redirectTo
  };
}

export const actions: Actions = {
  edit: async ({ request, fetch, locals }) => {
    let { user, session } = await locals.validateUser();

    // Get journalEntry from form data
    const formData = await request.formData();
    const input = Object.fromEntries(formData.entries());
    const { redirectTo } = input;

    const response = await fetch(`/api/profile/${user?.userId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        userFormData: input,
        redirectTo
      })
    }

    if (redirectTo && redirectTo != "") {
      throw redirect(303, redirectTo)
    }

    return data;
  },
}
