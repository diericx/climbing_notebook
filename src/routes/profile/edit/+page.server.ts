import { ProfileRepo } from '$lib/profile';
import { prisma } from '$lib/server/prisma';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await getSessionOrRedirect({ locals, url });

  const repo = new ProfileRepo(prisma);
  const profile = await repo.getOne(user?.userId);
  return {
    profile,
  };
};
