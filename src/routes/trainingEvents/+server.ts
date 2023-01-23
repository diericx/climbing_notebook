import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import PrismaClient from "$lib/prisma";
import type { TrainingEvent } from "$lib/trainingEvent";
const prisma = new PrismaClient();

const SERVER_ERROR = "There was an error on our end. Please try again later.";

export const GET = (async () => {
  let status = 200;
  let body = {};

  try {
    body = await prisma.trainingEvent.findMany();
  } catch (e) {
    console.error(e);
    status = 500;
    body = { message: SERVER_ERROR }
  }

  return json({ status, body });
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
  let status = 201;
  let body = {};
  let data = await request.formData();

  // Get trainingEvent from form data
  let newTrainingEvent = Object.fromEntries(data) as unknown as TrainingEvent;
  if (!newTrainingEvent.isValid()) {
    status = 401;
    body = { message: newTrainingEvent.validationMessage() };
    return json({ status, body });
  }

  try {
    body = await prisma.trainingEvent.create({
      data: newTrainingEvent,
    })
  } catch (e) {
    status = 500;
    body = { message: SERVER_ERROR }
  }

  return json({ status, body });
}) satisfies RequestHandler;


export const PATCH = (async ({ request, url }) => {
  let status = 200;
  let body = {}
  let data = await request.json();

  // Get trainingEvent from form data
  let newTrainingEvent = data as TrainingEvent;
  if (!newTrainingEvent.isValid()) {
    status = 401;
    body = { message: newTrainingEvent.validationMessage() };
    return json({ status, body });
  }

  try {
    body = await prisma.trainingEvent.update({
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
      },
    });
  } catch (e) {
    status = 500;
    body = { message: SERVER_ERROR }
  }

  return json({ status, body })
}) satisfies RequestHandler;

export const DELETE = (async ({ url }) => {
  let status = 204
  let body = {}

  try {
    await prisma.trainingEvent.delete({
      where: {
        id: Number(url.searchParams.get('trainingEventId')),
      },
    });
  } catch (e) {
    console.error(e);
    status = 500;
    body = { message: SERVER_ERROR }
  }

  return json({ status, body });
}) satisfies RequestHandler;

