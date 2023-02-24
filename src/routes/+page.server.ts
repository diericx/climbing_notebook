import { SERVER_ERROR } from "$lib/helperTypes";
import type { Profile } from "@prisma/client";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Unprotected page, session may not exist
  const session = await locals.validate();

  if (!session || session.state != 'active') {
    return {}
  }

  const response = await fetch(`/api/profile/${session?.userId}`, {
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

  return { profile }
}
