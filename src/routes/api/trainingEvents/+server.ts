import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import PrismaClient from "$lib/prisma";
import { TrainingEventInput } from "$lib/trainingEvent";
import type { TrainingEvent } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
const prisma = new PrismaClient();

export const GET = (async ({ locals }) => {
  // Validate session and get user
  let { user, session } = await locals.validateUser();
  if (!session || session.state !== 'active') {
    return json({ message: "unauthorized" }, { status: 403 });
  }

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
}) satisfies RequestHandler;

export const POST = (async ({ request, locals }) => {
  let data = await request.json();

  // Validate input fields
  let input = TrainingEventInput.fromObject(data)
  let inputValidation = input.validate()
  if (!inputValidation.isValid) {
    throw error(403, { message: inputValidation.message })
  }

  // Validate date string
  if (isNaN(Date.parse(input.date))) {
    throw error(403, { message: "A valid date is required." })
  }

  // Validate session and get user
  let { user, session } = await locals.validateUser();
  if (!session || session.state !== 'active') {
    throw error(403, { message: "unauthorized" })
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
}) satisfies RequestHandler;

export const PATCH = (async ({ locals, request, url }) => {
  let data = await request.json();

  // Get trainingEvent from form data
  let newTrainingEvent = data as TrainingEvent;
  if (!newTrainingEvent.isValid()) {
    throw error(401, { message: newTrainingEvent.validationMessage() })
  }

  // Validate session and get user
  let { user, session } = await locals.validateUser();
  if (!session || session.state !== 'active') {
    throw error(403, { message: "unauthorized" })
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
}) satisfies RequestHandler;

export const DELETE = (async ({ url, locals }) => {
  // Validate session and get user
  let { user, session } = await locals.validateUser();
  if (!session || session.state !== 'active') {
    throw error(403, { message: "unauthorized" })
  }

  let id = Number(url.searchParams.get('id'))
  if (isNaN(id)) {
    throw error(401, { message: "" })
  }

  try {
    await prisma.trainingEvent.deleteMany({
      where: {
        id: Number(url.searchParams.get('id')),
        ownerId: Number(user?.userId),
      },
    });
  } catch (e) {
    console.error(e);
    throw error(500, { message: SERVER_ERROR })
  }

  return json({}, { status: 204 });
}) satisfies RequestHandler;

