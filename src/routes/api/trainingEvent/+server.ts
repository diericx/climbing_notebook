import { json } from "@sveltejs/kit";
import type { RequestHandler } from '@sveltejs/kit';
import { TrainingEventFormData } from "$lib/trainingEvent";
import type { TrainingEvent } from "@prisma/client";
import { SERVER_ERROR } from "$lib/helperTypes";
import { protectedEndpoint } from "$lib/auth";
import { prisma } from "$lib/prisma";

export const GET: RequestHandler = protectedEndpoint(async ({ locals }) => {
  const { user } = locals;

  // Fetch trainingEvents
  let trainingEvents: TrainingEvent[];
  try {
    trainingEvents = await prisma.trainingEvent.findMany({
      where: {
        ownerId: Number(user?.userId),
      },
      orderBy: {
        date: 'desc',
      },
    }) as TrainingEvent[];
  } catch (e) {
    console.error(e);
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({ trainingEvents }, { status: 200 });
});

export const POST: RequestHandler = protectedEndpoint(async ({ request, locals }) => {
  let data = await request.json();
  const { user } = locals;

  // Validate input fields
  let input = TrainingEventFormData.fromObject(data)
  let { isValid, message } = input.validate()
  if (!isValid) {
    return json({ message }, { status: 403 })
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
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({ trainingEvent }, { status: 201 });
});

export const PATCH: RequestHandler = protectedEndpoint(async ({ locals, request, url }) => {
  let data = await request.json();
  const { user } = locals;

  // Get trainingEvent from form data
  let input = data as TrainingEventFormData;
  let { isValid, message } = input.validate()
  if (!isValid) {
    return json({ message }, { status: 401 })
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
    return json({ message: SERVER_ERROR }, { status: 500 })
  }

  return json({}, { status: 204 })
});

