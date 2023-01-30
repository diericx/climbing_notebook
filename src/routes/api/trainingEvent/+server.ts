import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import PrismaClient from "$lib/prisma";
import { TrainingEventInput } from "$lib/trainingEvent";
import type { TrainingEvent } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
const prisma = new PrismaClient();

export const GET: RequestHandler = protectedEndpoint(async ({ locals }) => {
  const { user } = locals;

  // Fetch trainingEvents
  let trainingEvents: TrainingEvent[];
  try {
    trainingEvents = await prisma.trainingEvent.findMany({
      where: {
        ownerId: Number(user?.userId),
      }
    }) as TrainingEvent[];
  } catch (e) {
    console.error(e);
    throw error(500, { message: SERVER_ERROR })
  }

  return json({ trainingEvents }, { status: 200 });
});

export const POST: RequestHandler = protectedEndpoint(async ({ request, locals }) => {
  let data = await request.json();
  const { user } = locals;

  // Validate input fields
  let input = TrainingEventInput.fromObject(data)
  let inputValidation = input.validate()
  if (!inputValidation.isValid) {
    throw error(403, { message: inputValidation.message })
  }

  let trainingEvent: TrainingEvent;
  try {
    trainingEvent = await prisma.trainingEvent.create({
      data: {
        ...input,
        date: new Date(Date.parse(input.date)),
        ownerId: Number(user?.userId),
        createdAt: new Date(),
      },
    }) as TrainingEvent;
  } catch (e) {
    console.error(e)
    throw error(500, { message: SERVER_ERROR });
  }

  return json({ trainingEvent }, { status: 201 });
});

export const PATCH: RequestHandler = protectedEndpoint(async ({ locals, request, url }) => {
  let data = await request.json();
  const { user } = locals;

  // Get trainingEvent from form data
  let input = data as TrainingEventInput;
  let { isValid, message } = input.validate()
  if (!isValid) {
    throw error(401, { message })
  }

  try {
    await prisma.trainingEvent.updateMany({
      data: {
        date: data?.date,
        label: data?.label,
        amount: data?.amount,
        amountUnit: data?.amountUnit,
        pointsPerUnit: data?.pointsPerUnit,
        type: data?.type,
      },
      where: {
        id: Number(url.searchParams.get('trainingEventId')),
        ownerId: Number(user?.userId),
      },
    });
  } catch (e) {
    throw error(500, { message: SERVER_ERROR })
  }

  return json({}, { status: 204 })
});

