import type { Actions, PageServerLoad } from "./$types";
import { chartActions } from "$lib/chart";
import { protectedPage } from "$lib/auth";
import { SERVER_ERROR } from "$lib/helperTypes";
import { error } from "console";
import type { Chart } from ".prisma/client";

export const load = protectedPage((async ({ fetch, params, url }) => {
  const { id } = params;
  const redirectTo = url.searchParams.get("redirectTo");

  const response = await fetch(`/api/chart/${id}`, {
    method: "GET",
  })
  if (!response.ok) {
    throw error(500, { message: SERVER_ERROR })
  }

  const data = await response.json();
  const chart: Chart = data.chart;

  return {
    chart,
    redirectTo
  };
}) satisfies PageServerLoad)

export const actions: Actions = {
  ...chartActions
}
