import type { Actions, PageServerLoad } from "./$types";
import { chartActions } from "$lib/chart";

export const load: PageServerLoad = async ({ url }) => {
  const redirectTo = url.searchParams.get("redirectTo");

  return {
    redirectTo
  };
};

export const actions: Actions = {
  ...chartActions
}
