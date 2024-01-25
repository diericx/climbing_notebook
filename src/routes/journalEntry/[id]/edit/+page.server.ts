import { JournalEntryRepo } from '$lib/journalEntry';
import { prisma } from '$lib/server/prisma';
import { getSessionOrRedirect } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await getSessionOrRedirect({ locals });

  const id = Number(params.id);

  const repo = new JournalEntryRepo(prisma);
  const journalEntry = await repo.getOne({
    id,
    userId: user?.userId,
    select: JournalEntryRepo.selectEverything,
  });
  return {
    journalEntry,
  };
};
