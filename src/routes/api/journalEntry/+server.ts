import { json } from "@sveltejs/kit";
import type { RequestHandler } from '@sveltejs/kit';
import { JournalEntryFormData } from "$lib/journalEntry";
import type { JournalEntry } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
import { prisma } from "$lib/prisma";
import { matchMetricsInString, parseMetricStrings, toNum } from "$lib/utils";

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

  // Fetch journalEntries with same day to validate this is a new date
  let journalEntries: JournalEntry[];
  try {
    journalEntries = await prisma.journalEntry.findMany({
      where: {
        ownerId: Number(user?.userId),
        date: new Date(Date.parse(input.date)),
      },
    }) as JournalEntry[];
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 })
  }
  if (journalEntries.length > 0) {
    return json({ message: "Journal entry for that date already exists" }, { status: 401 })
  }

  // Add new journal entry
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

  let metrics = parseMetricStrings(matchMetricsInString(input.content))
  let createMetricsForThisEntry = metrics.map(m => prisma.metric.create({
    data: {
      name: m.name,
      // Number parse is implied succesful with regex match?
      value: toNum(m.value, 0),
      date: new Date(Date.parse(input.date)),
      journalEntryId: Number(journalEntry.id),
      ownerId: Number(user?.userId)
    }
  }))
  try {
    await prisma.$transaction([
      ...createMetricsForThisEntry,
    ])
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  return json({ journalEntry }, { status: 201 });
});

