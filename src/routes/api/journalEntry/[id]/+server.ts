import { error, json } from "@sveltejs/kit";
import PrismaClient from "$lib/prisma";
import type { RequestHandler } from "../$types";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
import { JournalEntryInput } from "$lib/journalEntry";
import type { JournalEntry } from "@prisma/client";
const prisma = new PrismaClient();

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
      throw error(404, { message: "Journal entry not found." })
    }
    journalEntry = journalEntries[0]
  } catch (e) {
    console.error(e);
    throw error(500, { message: SERVER_ERROR })
  }

  return json({ journalEntry }, { status: 200 });
});

export const DELETE: RequestHandler = protectedEndpoint(async ({ locals, params }) => {
  const { id } = params
  const { user } = locals

  // Validate params
  if (!id || isNaN(Number(id))) {
    throw error(401, { message: "Valid id required" })
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
    throw error(500, { message: SERVER_ERROR })
  }

  return json({}, { status: 200 });
});

export const PATCH: RequestHandler = protectedEndpoint(async ({ locals, request, url, params }) => {
  let data = await request.json();
  const { user } = locals;
  const { id } = params;

  // Get journalEntry from form data
  let input = JournalEntryInput.fromObject(data)
  let { isValid, message } = input.validate()
  if (!isValid) {
    throw error(401, { message })
  }

  // Validate date string
  if (isNaN(Date.parse(input.date))) {
    throw error(403, { message: "A valid date is required." })
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
    throw error(500, { message: SERVER_ERROR })
  }

  if (result.count == 0) {
    throw error(404, { message: "Journal entry not found" })
  }

  return json({ message: "Journal entry was updated succesfully" }, { status: 200 })
});

