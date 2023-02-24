import type { RequestHandler } from '@sveltejs/kit';
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { TrainingProgramDay } from "@prisma/client";
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
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({ trainingProgramDay }, { status: 200 });
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
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  if (result.count == 0) {
    return json({ message: "Training program day not fouind" }, { status: 404 })
  }

  return json({ message: "Training program day was updated succesfully" }, { status: 200 })
});

