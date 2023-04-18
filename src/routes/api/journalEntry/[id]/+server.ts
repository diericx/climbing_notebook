import { json } from "@sveltejs/kit";
import type { RequestHandler } from '@sveltejs/kit';
import { SERVER_ERROR } from "$lib/helperTypes";
import { JournalEntryFormData } from "$lib/journalEntry";
import type { JournalEntry } from "@prisma/client";
import { prisma } from "$lib/prisma";
import { matchMetricsInString, parseMetricStrings, toNum } from "$lib/utils";

export const GET: RequestHandler = async ({ locals, params }) => {
  const { user } = locals;
  const { id } = params;

  // Fetch journalEntries
  let journalEntry: JournalEntry;
  try {
    let journalEntries = await prisma.journalEntry.findMany({
      where: {
        ownerId: Number(user?.userId),
        id: Number(id),
      }
    }) as JournalEntry[];
    if (journalEntries.length == 0) {
      return json({ message: "Journal entry not found." }, { status: 404 })
    }
    journalEntry = journalEntries[0]
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({ journalEntry }, { status: 200 });
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const { id } = params
  const { user } = locals

  // Validate params
  if (!id || isNaN(Number(id))) {
    return json({ message: "Valid id required" }, { status: 401 })
  }

  try {
    await prisma.journalEntry.deleteMany({
      where: {
        id: Number(id),
        ownerId: Number(user?.userId),
      },
    });
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({}, { status: 200 });
};

export const PATCH: RequestHandler = async ({ locals, request, url, params }) => {
  let data = await request.json();
  const { user } = locals;
  const { id } = params;

  // Validate params
  if (!id || isNaN(Number(id))) {
    return json({ message: "Valid id required" }, { status: 401 })
  }

  // Get form data
  let input: JournalEntryFormData
  try {
    input = new JournalEntryFormData(data)
  } catch (e) {
    let message = SERVER_ERROR;
    if (e instanceof Error) message = e.message
    return json({ message }, { status: 401 })
  }

  let { isValid, message } = input.validate()
  if (!isValid) {
    return json({ message }, { status: 401 })
  }

  let result
  try {
    result = await prisma.journalEntry.updateMany({
      data: {
        date: new Date(Date.parse(input.date)),
        content: input.content,
        type: input.type,
      },
      where: {
        id: Number(id),
        ownerId: Number(user?.userId),
      },
    });
  } catch (e) {
    console.error(e)
    return json({ message: SERVER_ERROR }, { status: 500 })
  }
  if (result.count == 0) {
    return json({ message: "Journal entry not found." }, { status: 404 })
  }

  let metrics = parseMetricStrings(matchMetricsInString(input.content))
  let deleteMetricsForThisEntry = prisma.metric.deleteMany({
    where: {
      ownerId: Number(user?.userId),
      date: new Date(Date.parse(input.date)),
      journalEntryId: Number(id),
    }
  })
  let createMetricsForThisEntry = metrics.map(m => prisma.metric.create({
    data: {
      name: m.name,
      // Number parse is implied succesful with regex match?
      value: toNum(m.value, 0),
      date: new Date(Date.parse(input.date)),
      journalEntryId: Number(id),
      ownerId: Number(user?.userId)
    }
  }))
  try {
    await prisma.$transaction([
      deleteMetricsForThisEntry,
      ...createMetricsForThisEntry,
    ])
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  return json({ message: "Journal entry was updated succesfully" }, { status: 200 })
};

