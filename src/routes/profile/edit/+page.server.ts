import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { SERVER_ERROR } from '$lib/helperTypes';
import type { Profile } from '@prisma/client';
import { prisma } from '$lib/prisma';
import { ProfileRepo } from '$lib/profile';
import { APIError } from '$lib/errors';
import { getSessionOrRedirect } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const repo = new ProfileRepo(prisma);
  const profile = await repo.getOne(user?.userId);
  return {
    profile,
  };
};
