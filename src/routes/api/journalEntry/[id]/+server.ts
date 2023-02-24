import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
import { JournalEntryFormData } from "$lib/journalEntry";
import type { JournalEntry } from "@prisma/client";
import { prisma } from "$lib/prisma";

export const GET: RequestHandler = protectedEndpoint(async ({ locals, params }) => {
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
});

export const DELETE: RequestHandler = protectedEndpoint(async ({ locals, params }) => {
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
});

export const PATCH: RequestHandler = protectedEndpoint(async ({ locals, request, url, params }) => {
  let data = await request.json();
  const { user } = locals;
  const { id } = params;

  // Validate params
  if (!id || isNaN(Number(id))) {
    return json({ message: "Valid id required" }, { status: 401 })
  }

  // Get form data
  let input = JournalEntryFormData.fromObject(data)
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

  return json({ message: "Journal entry was updated succesfully" }, { status: 200 })
});

