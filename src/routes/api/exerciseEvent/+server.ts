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
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({ exercises }, { status: 200 });
});

export const POST: RequestHandler = protectedEndpoint(async ({ request, locals }) => {
  let data = await request.json();
  const { user } = locals;

  // Validate input fields
  let input = ExerciseEventFormData.fromObject(data)
  let { isValid, message } = input.validate()
  if (!isValid) {
    return json({ message }, { status: 401 })
  }

  let exerciseEvent: ExerciseEvent;
  try {
    exerciseEvent = await prisma.exerciseEvent.create({
      data: {
        ...input,
        date: input.date ? new Date(Date.parse(input.date)) : undefined,
        ownerId: Number(user.userId),
        createdAt: new Date(),
      },
    }) as ExerciseEvent;
  } catch (e) {
    console.error(e)
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({ exerciseEvent }, { status: 201 });
});

