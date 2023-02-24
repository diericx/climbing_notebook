import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { JournalEntryFormData } from "$lib/journalEntry";
import type { JournalEntry } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
import { prisma } from "$lib/prisma";

export const GET: RequestHandler = protectedEndpoint(async ({ locals }) => {
  const { user } = locals;

  // Fetch journalEntries
  let journalEntries: JournalEntry[];
  try {
    journalEntries = await prisma.journalEntry.findMany({
      where: {
        ownerId: Number(user?.userId),
      },
      orderBy: {
        date: 'desc',
      },
    }) as JournalEntry[];
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({ journalEntries }, { status: 200 });
});

export const POST: RequestHandler = protectedEndpoint(async ({ request, locals }) => {
  let data = await request.json();
  const { user } = locals;

  // Validate input fields
  let input = JournalEntryFormData.fromObject(data)
  let { message, isValid } = input.validate()
  if (!isValid) {
    return json({ message }, { status: 401 })
  }

  let journalEntry: JournalEntry;
  try {
    journalEntry = await prisma.journalEntry.create({
      data: {
        ...input,
        date: new Date(Date.parse(input.date)),
        ownerId: Number(user?.userId),
        createdAt: new Date(),
      },
    }) as JournalEntry;
  } catch (e) {
    console.error(e)
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({ journalEntry }, { status: 201 });
});
