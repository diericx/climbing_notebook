import { journalEntrySelects } from '$lib/prismaHelpers/journalEntryHelper';
import { prisma } from '$lib/server/prisma';
import { JournalEntryRepo } from '$lib/server/repos/journalEntry';
import { type JournalEntry } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export type APIJournalEntriesResponse = JournalEntry[];

export const GET: RequestHandler = async ({ url, locals }) => {
  const session = await locals.auth.validate();
  if (session === null) {
    throw error(403);
  }

  const user = session.user;
  const journalEntryRepo = new JournalEntryRepo(prisma);

  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');

  if (start == null) {
    throw error(401, 'Must specify start date');
  }
  if (end == null) {
    throw error(401, 'Must specify end date');
  }

  // Workaround for time zone adjustmants made by date... and the fact that
  // date coming from calendar is not full iso string... lame
  const startDate = new Date(start);
  startDate.setUTCHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setUTCHours(0, 0, 0, 0);

  const journalEntries = await journalEntryRepo.getManyForUser({
    userId: user?.userId,
    select: journalEntrySelects.minimal,
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  return json(journalEntries);
};
