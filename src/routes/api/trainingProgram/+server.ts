import { json } from "@sveltejs/kit";
import type { RequestHandler } from '@sveltejs/kit';
import { TrainingProgramFormData } from "$lib/trainingProgram";
import type { ExerciseEvent, TrainingProgram } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { prisma } from "$lib/prisma";

export const GET: RequestHandler = async ({ locals }) => {
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
};

export const POST: RequestHandler = async ({ request, locals }) => {
  let data = await request.json();
  const { user } = locals;

  // Validate input fields
  let input = new TrainingProgramFormData(data)
  let { isValid, message } = input.validate()
  if (!isValid) {
    return json({ message }, { status: 400 });
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
};

