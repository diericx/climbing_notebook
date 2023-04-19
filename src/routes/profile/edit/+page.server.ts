import type { Actions } from "./$types";
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from "../$types";
import { SERVER_ERROR } from "$lib/helperTypes";
import type { Profile } from "@prisma/client";
import { prisma } from "$lib/prisma";
import { ProfileFormData, ProfileRepo } from "$lib/profile";
import { APIError } from "$lib/errors";

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.auth.validateUser();

  const repo = new ProfileRepo(prisma);
  let profile: Profile;
  try {
    profile = await repo.getOne(Number(user?.userId));
  } catch (e) {
    if (e instanceof APIError) {
      return fail(401, { message: e.detail })
    }
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  return {
    profile,
  };
};

export const actions: Actions = {
  editProfile: async ({ locals, request, url }) => {
    const rawFormData = Object.fromEntries((await request.formData()).entries());
    const { user } = await locals.auth.validateUser();

    // Validate input fields
    const input = new ProfileFormData(rawFormData);
    let { message, isValid } = input.validate()
    if (!isValid) {
      return fail(401, { message, profileFormData: rawFormData })
    }

    const repo = new ProfileRepo(prisma);
    try {
      await repo.update(input, Number(user?.userId));
    } catch (e) {
      if (e instanceof APIError) {
        return fail(401, { message: e.detail, profileFormData: rawFormData })
      }
      console.error(e)
      throw error(500, { message: SERVER_ERROR })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  }
}
