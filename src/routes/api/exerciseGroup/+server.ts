
import { json, type RequestHandler } from '@sveltejs/kit';
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { ExerciseGroup } from "@prisma/client";
import { ExerciseGroupFormData } from "$lib/exerciseGroup";

export const POST: RequestHandler = protectedEndpoint(async ({ request, locals }) => {
  let data = await request.json();
  const { user } = locals;

  // Validate input fields
  let input = ExerciseGroupFormData.fromObject(data)
  let { isValid, message } = input.validate()
  if (!isValid) {
    return json({ message }, { status: 403 });
  }

  let exerciseGroup: ExerciseGroup;
  try {
    exerciseGroup = await prisma.exerciseGroup.create({
      data: {
        name: input.name,
        trainingProgramId: input.trainingProgramId,
        ownerId: Number(user?.userId),
      }
    }) as ExerciseGroup;
  } catch (e) {
    console.error(e)
    return json({ message: SERVER_ERROR }, { status: 500 });
  }

  return json({ exerciseGroup }, { status: 201 });
});
