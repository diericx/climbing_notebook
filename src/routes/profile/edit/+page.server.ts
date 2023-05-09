import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { SERVER_ERROR } from '$lib/helperTypes';
import type { Profile } from '@prisma/client';
import { prisma } from '$lib/prisma';
import { ProfileRepo } from '$lib/profile';
import { APIError } from '$lib/errors';

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.auth.validateUser();

  const repo = new ProfileRepo(prisma);
  let profile: Profile;
  try {
    profile = await repo.getOne(user?.userId);
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
