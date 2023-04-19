import { APIError } from '$lib/errors';
import { SERVER_ERROR } from '$lib/helperTypes';
import { prisma } from '$lib/prisma';
import { ProfileRepo } from '$lib/profile';
import type { Profile } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
    user,
  };
};
