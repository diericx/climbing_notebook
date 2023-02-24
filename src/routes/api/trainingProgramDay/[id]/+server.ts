import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { TrainingProgramDay } from "@prisma/client";
import { ExerciseEventFormData } from "$lib/exerciseEvent";
import { TrainingProgramDayFormData } from "$lib/trainingProgramDay";

export const GET: RequestHandler = protectedEndpoint(async ({ locals, params }) => {
  const { user } = locals;
  const { id } = params;

  let trainingProgramDay: TrainingProgramDay;
  try {
    let trainingProgramDays = await prisma.trainingProgramDay.findMany({
      where: {
        assignedBy: Number(user?.userId),
        id: Number(id),
      },
      orderBy: {
        dayOfTheWeek: 'asc',
      },
    }) as TrainingProgramDay[];
    if (trainingProgramDays.length == 0) {
      return json({ message: "Training program not found." }, { status: 404 })
    }
    trainingProgramDay = trainingProgramDays[0]
  } catch (e) {
    console.error(e);
    throw error(500, { message: SERVER_ERROR })
  }

  return json({ trainingProgramDay }, { status: 200 });
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
  let input = TrainingProgramDayFormData.fromObject(data)

  let result
  try {
    result = await prisma.trainingProgramDay.updateMany({
      where: {
        id: Number(id),
        assignedBy: Number(user?.userId),
      },
      data: {
        description: input.description,
      },
    });
  } catch (e) {
    console.error(e)
    throw error(500, { message: SERVER_ERROR })
  }

  if (result.count == 0) {
    throw error(404, { message: "Training program day not found" })
  }

  return json({ message: "Training program day was updated succesfully" }, { status: 200 })
});

