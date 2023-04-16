import type { Actions, PageServerLoad } from "./$types";
import { chartActions } from "$lib/chart";
import { protectedPage } from "$lib/auth";

export const load = protectedPage((async ({ fetch, params, url }) => {
  const redirectTo = url.searchParams.get("redirectTo");

  return {
    redirectTo
  };
}) satisfies PageServerLoad)

export const actions: Actions = {
  ...chartActions
}
