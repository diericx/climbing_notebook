import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { ChartFormData, ChartRepo } from "$lib/chart";
import { prisma } from "$lib/prisma";
import { APIError } from "$lib/errors";
import { SERVER_ERROR } from "$lib/helperTypes";

export const load: PageServerLoad = async ({ url }) => {
  const redirectTo = url.searchParams.get("redirectTo");

  return {
    redirectTo
  };
};

export const actions: Actions = {
  newChart: async ({ request, url, locals }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();

    // Validate input fields
    const input = new ChartFormData(rawFormData);
    let { message, isValid } = input.validate()
    if (!isValid) {
      return fail(401, { message, chartFormData: rawFormData })
    }

    const repo = new ChartRepo(prisma);
    try {
      await repo.new(input, Number(user?.userId))
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
}
