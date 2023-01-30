import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import PrismaClient from "$lib/prisma";
import { JournalEntryInput } from "$lib/journalEntry";
import type { JournalEntry } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
const prisma = new PrismaClient();

export const GET: RequestHandler = protectedEndpoint(async ({ locals }) => {
  const { user } = locals;

  // Fetch journalEntries
  let journalEntries: JournalEntry[];
  try {
    journalEntries = await prisma.journalEntry.findMany({
      where: {
        ownerId: Number(user?.userId),
      }
    }) as JournalEntry[];
  } catch (e) {
    console.error(e);
    throw error(500, { message: SERVER_ERROR })
  }

  return json({ journalEntries }, { status: 200 });
});

export const POST: RequestHandler = protectedEndpoint(async ({ request, locals }) => {
  let data = await request.json();
  const { user } = locals;

  // Validate input fields
  let input = JournalEntryInput.fromObject(data)
  let inputValidation = input.validate()
  if (!inputValidation.isValid) {
    throw error(403, { message: inputValidation.message })
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
    throw error(500, { message: SERVER_ERROR });
  }

  return json({ journalEntry }, { status: 201 });
});

