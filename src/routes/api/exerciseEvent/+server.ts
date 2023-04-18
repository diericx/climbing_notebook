import { json } from "@sveltejs/kit";
import type { RequestHandler } from '@sveltejs/kit';
import { ExerciseEventFormData } from "$lib/exerciseEvent";
import type { ExerciseEvent } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { prisma } from "$lib/prisma";

export const GET: RequestHandler = async ({ locals, url }) => {
  const { user } = locals;

  const dateMin = url.searchParams.get('dateMin') ?? undefined
  const dateMax = url.searchParams.get('dateMax') ?? undefined

  // Fetch exercise events
  let exercises: ExerciseEvent[];
  try {
    exercises = await prisma.exerciseEvent.findMany({
      where: {
        ownerId: Number(user?.userId),
        trainingProgramDay: null,
        exerciseGroup: null,
        date: {
          lte: dateMax ? new Date(dateMax) : undefined,
          gte: dateMin ? new Date(dateMin) : undefined,
        },
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
};

export const POST: RequestHandler = async ({ request, locals }) => {
  let data = await request.json();
  const { user } = locals;

  // Validate input fields
  let input = new ExerciseEventFormData(data)
  let { isValid, message } = input.validate()
  if (!isValid) {
    return json({ message }, { status: 401 })
  }

  let exerciseEvent: ExerciseEvent;
  try {
    exerciseEvent = await prisma.exerciseEvent.create({
      data: {
        ...input,
        date: new Date(input.date),
        ownerId: Number(user.userId),
        createdAt: new Date(),
      },
    }) as ExerciseEvent;
  } catch (e) {
    console.error(e)
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({ exerciseEvent }, { status: 201 });
};

