import type { Actions } from "./$types";
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from "../$types";
import { SERVER_ERROR } from "$lib/helperTypes";
import type { Profile } from "@prisma/client";
import { profileActions } from "$lib/profile";

export const load: PageServerLoad = async ({ fetch, url, params }) => {
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
};

export const actions: Actions = {
  ...profileActions
}
