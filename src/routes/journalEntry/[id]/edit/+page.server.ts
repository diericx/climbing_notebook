import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { JournalEntry } from '@prisma/client';
import { SERVER_ERROR } from '$lib/helperTypes';
import { JournalEntryRepo } from '$lib/journalEntry';
import { prisma } from '$lib/prisma';
import { APIError } from '$lib/errors';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.auth.validate();
  const id = Number(params.id);

  const repo = new JournalEntryRepo(prisma);
  try {
    const journalEntry = await repo.getOneAndValidateOwner(id, user?.userId);
    return {
      journalEntry,
    };
  } catch (e) {
    if (e instanceof APIError) {
      throw error(404, { message: 'Not found' });
    }
    console.error(e);
    throw error(500, { message: SERVER_ERROR });
  }
};
