import type { Actions } from "./$types";
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { JournalEntry } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { journalEntryActions } from "$lib/journalEntry";

export const load: PageServerLoad = async ({ fetch, url, params }) => {
  const { id } = params;

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
  };
};

export const actions: Actions = {
  ...journalEntryActions,
}
