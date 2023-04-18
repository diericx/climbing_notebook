import type { Actions, PageServerLoad } from "./$types";
import { chartActions } from "$lib/chart";
import { SERVER_ERROR } from "$lib/helperTypes";
import { error } from "console";
import type { Chart } from ".prisma/client";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const { id } = params;

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
  };
};

export const actions: Actions = {
  ...chartActions
}
