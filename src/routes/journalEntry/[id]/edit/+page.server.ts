import { journalEntrySelects } from '$lib/prismaHelpers/journalEntryHelper';
import { prisma } from '$lib/server/prisma';
import { JournalEntryRepo } from '$lib/server/repos/journalEntry';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await getSessionOrRedirect({ locals });

  const id = Number(params.id);

  const repo = new JournalEntryRepo(prisma);
  const journalEntry = await repo.getOne({
    id,
    userId: user?.userId,
    select: journalEntrySelects.everything,
  });
  return {
    journalEntry,
  };
};
