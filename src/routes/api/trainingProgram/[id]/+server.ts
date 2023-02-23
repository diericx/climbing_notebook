import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { ExerciseEvent } from "@prisma/client";
import { ExerciseEventFormData } from "$lib/exerciseEvent";

export const GET: RequestHandler = protectedEndpoint(async ({ locals, params }) => {
  const { user } = locals;
  const { id } = params;

  // Fetch exercise events
  let exerciseEvent: ExerciseEvent;
  try {
    let exerciseEvents = await prisma.exerciseEvent.findMany({
      where: {
        ownerId: Number(user?.userId),
        id: Number(id),
      }
    }) as ExerciseEvent[];
    if (exerciseEvents.length == 0) {
      throw error(404, { message: "Exercise event not found." })
    }
    exerciseEvent = exerciseEvents[0]
  } catch (e) {
    console.error(e);
    throw error(500, { message: SERVER_ERROR })
  }

  return json({ exerciseEvent }, { status: 200 });
});

export const DELETE: RequestHandler = protectedEndpoint(async ({ locals, params }) => {
  const { id } = params
  const { user } = locals

  // Validate params
  if (!id || isNaN(Number(id))) {
    throw error(401, { message: "Valid id required" })
  }

  try {
    await prisma.exerciseEvent.deleteMany({
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

  // Validate params
  if (!id || isNaN(Number(id))) {
    throw error(401, { message: "Valid id required" })
  }

  // Get form data
  let input = ExerciseEventFormData.fromObject(data)
  let { isValid, message } = input.validate()
  if (!isValid) {
    throw error(401, { message })
  }

  let result
  try {
    result = await prisma.exerciseEvent.updateMany({
      data: {
        date: new Date(Date.parse(input.date)),
        name: input.name,
        weight: input.weight,
        difficulty: input.difficulty,
        notes: input.notes
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

  return json({ message: "Training event was updated succesfully" }, { status: 200 })
});

