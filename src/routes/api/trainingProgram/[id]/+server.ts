import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { TrainingProgram } from "@prisma/client";
import { TrainingProgramFormData } from "$lib/trainingProgram";

export const GET: RequestHandler = protectedEndpoint(async ({ locals, params }) => {
  const { user } = locals;
  const { id } = params;

  let trainingProgram: TrainingProgram;
  try {
    let trainingPrograms = await prisma.trainingProgram.findMany({
      where: {
        ownerId: Number(user?.userId),
        id: Number(id),
      },
      include: {
        days: {
          include: {
            exercises: true,
          },
          orderBy: {
            // Note: ui depends on this being sorted in this way
            dayOfTheWeek: 'asc',
          },
        }
      }
    }) as TrainingProgram[];
    if (trainingPrograms.length == 0) {
      return json({ message: "Training program not found." }, { status: 404 })
    }
    trainingProgram = trainingPrograms[0]
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  return json({ trainingProgram }, { status: 200 });
});

export const DELETE: RequestHandler = protectedEndpoint(async ({ locals, params }) => {
  const { id } = params
  const { user } = locals

  // Validate params
  if (!id || isNaN(Number(id))) {
    return json({ message: "Valid id required" }, { status: 401 });
  }

  try {
    await prisma.trainingProgram.deleteMany({
      where: {
        id: Number(id),
        ownerId: Number(user?.userId),
      },
    });
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  return json({ message: "Successfuly deleted" }, { status: 200 });
});

export const PATCH: RequestHandler = protectedEndpoint(async ({ locals, request, url, params }) => {
  let data = await request.json();
  const { user } = locals;
  const { id } = params;

  // Validate params
  if (!id || isNaN(Number(id))) {
    return json({ message: "Valid id required" }, { status: 401 });
  }

  // Get form data
  let input = TrainingProgramFormData.fromObject(data)

  let result
  try {
    result = await prisma.trainingProgram.updateMany({
      where: {
        id: Number(id),
        ownerId: Number(user?.userId),
      },
      data: {
        name: input.name,
      },
    });
  } catch (e) {
    console.error(e)
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  if (result.count == 0) {
    return json({ message: "Training program not found" }, { status: 404 });
  }

  return json({ message: "Training program was updated succesfully" }, { status: 200 })
});

