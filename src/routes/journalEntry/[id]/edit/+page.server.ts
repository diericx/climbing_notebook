import type { Actions } from "./$types";
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { JournalEntry } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedPage } from "$lib/auth";
import { journalEntryActions } from "$lib/journalEntry";

export const load = protectedPage((async ({ fetch, url, params }) => {
  const { id } = params;
  const redirectTo = url.searchParams.get("redirectTo");

  const response = await fetch(`/api/journalEntry/${id}`, {
    method: "GET",
  })
  if (!response.ok) {
    throw error(500, { message: SERVER_ERROR })
  }

  const data = await response.json();
  const journalEntry: JournalEntry = data.journalEntry;

  return {
    journalEntry,
    redirectTo
  };
}) satisfies PageServerLoad)

export const actions: Actions = {
  ...journalEntryActions
}
