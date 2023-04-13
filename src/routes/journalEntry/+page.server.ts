import type { Actions } from "./$types";
import type { PageServerLoad } from './$types';
import type { JournalEntry } from "@prisma/client";
import { protectedPage } from "$lib/auth";
import { journalEntryActions } from "$lib/journalEntry";

export const load = protectedPage((async ({ fetch }) => {
  const response = await fetch("/api/journalEntry", {
    method: "GET",
  })
  const data = await response.json();
  const journalEntries: JournalEntry[] = data.journalEntries;

  return {
    journalEntries,
  };
}) satisfies PageServerLoad)

export const actions: Actions = {
  ...journalEntryActions
}
