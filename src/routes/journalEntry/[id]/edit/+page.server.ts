import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { JournalEntry } from '@prisma/client';
import { SERVER_ERROR } from '$lib/helperTypes';
import { JournalEntryRepo } from '$lib/journalEntry';
import { prisma } from '$lib/prisma';
import { APIError } from '$lib/errors';
import { getSessionOrRedirect } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await getSessionOrRedirect({ locals });

  const id = Number(params.id);

  const repo = new JournalEntryRepo(prisma);
  const journalEntry = await repo.getOneAndValidateOwner(id, user?.userId);
  return {
    journalEntry,
  };
};
