import { json } from "@sveltejs/kit";
import type { RequestHandler } from '@sveltejs/kit';
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
      return json({ message: "Exercise event not found." }, { status: 404 })
    }
    exerciseEvent = exerciseEvents[0]
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({ exerciseEvent }, { status: 200 });
});

export const DELETE: RequestHandler = protectedEndpoint(async ({ locals, params }) => {
  const { id } = params
  const { user } = locals

  // Validate params
  if (!id || isNaN(Number(id))) {
    return json({ message: "Valid id required" }, { status: 401 })
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
  let input = ExerciseEventFormData.fromObject(data)
  let { isValid, message } = input.validate()
  if (!isValid) {
    return json({ message }, { status: 401 })
  }

  let result
  try {
    result = await prisma.exerciseEvent.updateMany({
      data: {
        sets: input.sets || undefined,
        reps: input.reps || undefined,
        weight: input.weight || undefined,
        minutes: input.minutes || undefined,
        seconds: input.seconds || undefined,
        difficulty: input.difficulty || undefined,
        notes: input.notes || undefined,
        trainingProgramDayId: input.trainingProgramDayId || undefined,
        exerciseGroupId: input.exerciseGroupId || undefined,
        name: input.name || undefined,
        date: input.date ? new Date(Date.parse(input.date)) : undefined,
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
    return json({ message: "Exercise event not found." }, { status: 404 })
  }

  return json({ message: "Training event was updated succesfully" }, { status: 200 })
});

