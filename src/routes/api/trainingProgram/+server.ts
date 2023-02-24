import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { TrainingProgramFormData } from "$lib/trainingProgram";
import type { ExerciseEvent, TrainingProgram } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
import { prisma } from "$lib/prisma";

export const GET: RequestHandler = protectedEndpoint(async ({ locals }) => {
  const { user } = locals;

  // Fetch 
  let trainingPrograms: TrainingProgram[];
  try {
    trainingPrograms = await prisma.trainingProgram.findMany({
      where: {
        ownerId: Number(user?.userId),
      },
      orderBy: {
        createdAt: 'desc',
      },
    }) as ExerciseEvent[];
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  return json({ trainingPrograms }, { status: 200 });
});

export const POST: RequestHandler = protectedEndpoint(async ({ request, locals }) => {
  let data = await request.json();
  const { user } = locals;

  // Validate input fields
  let input = TrainingProgramFormData.fromObject(data)
  let { isValid, message } = input.validate()
  if (!isValid) {
    return json({ message }, { status: 403 });
  }

  let trainingProgram: TrainingProgram;
  try {
    trainingProgram = await prisma.trainingProgram.create({
      data: {
        name: input.name,
        ownerId: Number(user?.userId),
        days: {
          create: Array.apply(null, Array(7)).map((_, i) => {
            return {
              assignedBy: Number(user?.userId),
              dayOfTheWeek: i,
              description: "",
            }
          })
        },
      }
    }) as TrainingProgram;
  } catch (e) {
    console.error(e)
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  return json({ trainingProgram }, { status: 201 });
});

