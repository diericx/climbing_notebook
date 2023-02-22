import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { ExerciseEventFormData } from "$lib/exerciseEvent";
import type { ExerciseEvent } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
import { prisma } from "$lib/prisma";

export const GET: RequestHandler = protectedEndpoint(async ({ locals }) => {
  const { user } = locals;

  // Fetch exercise events
  let exercises: ExerciseEvent[];
  try {
    exercises = await prisma.exerciseEvent.findMany({
      where: {
        ownerId: Number(user?.userId),
      },
      orderBy: {
        date: 'desc',
      },
    }) as ExerciseEvent[];
  } catch (e) {
    console.error(e);
    throw error(500, { message: SERVER_ERROR })
  }

  return json({ exercises }, { status: 200 });
});

export const POST: RequestHandler = protectedEndpoint(async ({ request, locals }) => {
  let data = await request.json();
  const { user } = locals;

  // Validate input fields
  let input = ExerciseEventFormData.fromObject(data)
  let inputValidation = input.validate()
  if (!inputValidation.isValid) {
    throw error(403, { message: inputValidation.message })
  }

  let exerciseEvent: ExerciseEvent;
  try {
    exerciseEvent = await prisma.exerciseEvent.create({
      data: {
        ...input,
        date: new Date(Date.parse(input.date)),
        ownerId: Number(user?.userId),
        createdAt: new Date(),
      },
    }) as ExerciseEvent;
  } catch (e) {
    console.error(e)
    throw error(500, { message: SERVER_ERROR });
  }

  return json({ exerciseEvent }, { status: 201 });
});

