import type { Actions, PageServerLoad } from "./$types";
import { SERVER_ERROR } from "$lib/helperTypes";
import { error } from "console";
import { fail, redirect } from "@sveltejs/kit";
import { ChartFormData, ChartRepo } from "$lib/chart";
import { prisma } from "$lib/prisma";
import { APIError } from "$lib/errors";
import type { Chart } from "@prisma/client";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validateUser();
  const id = Number(params.id);

  const repo = new ChartRepo(prisma);
  let chart: Chart;
  try {
    chart = await repo.getOne(id, Number(user?.userId));
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  return {
    chart,
  };
};

export const actions: Actions = {
  editChart: async ({ locals, params, request, url }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();
    let id = Number(params.id);

    // Validate input fields
    const input = new ChartFormData(rawFormData);
    let { message, isValid } = input.validate()
    if (!isValid) {
      return fail(401, { message, chartFormData: rawFormData })
    }

    const repo = new ChartRepo(prisma);
    try {
      await repo.update(input, id, Number(user?.userId));
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, chartFormData: rawFormData })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },

  deleteChart: async ({ locals, request, url }) => {
    const { user } = locals
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const id = Number(rawFormData.id)

    const repo = new ChartRepo(prisma);
    try {
      await repo.delete(id, Number(user?.userId));
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },
}
