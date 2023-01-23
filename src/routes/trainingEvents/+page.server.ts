import type { Actions } from "./$types";
import { fail } from '@sveltejs/kit';
import PrismaClient from "$lib/prisma";
import { TrainingEvent } from "$lib/trainingEvent";
const prisma = new PrismaClient();

export async function load() {
  // TODO: wrap this in a library 
  const prisma = new PrismaClient();
  const events = await prisma.trainingEvent.findMany();
  const recoveryEvents: TrainingEvent[] = [];
  const trainingEvents: TrainingEvent[] = [];

  let recoveryPoints = 0;
  let trainingPoints = 0;
  for (const item of events) {
    if (item.type == "recovery") {
      recoveryEvents.push(item as TrainingEvent);
      recoveryPoints += item.pointsPerUnit * item.amount;
    } else {
      trainingEvents.push(item as TrainingEvent);
      trainingPoints += item.pointsPerUnit * item.amount;
    }
  }

  return {
    trainingPoints,
    recoveryPoints,
    events,
  };
}

export const actions: Actions = {
  new: async ({ request }) => {
    const data = await request.formData();

    // Get trainingEvent from form data
    const newTrainingEvent: TrainingEvent = TrainingEvent.fromFormData(data);
    if (!newTrainingEvent.isValid()) {
      return fail(401, {
        message: newTrainingEvent.validationMessage(),
        newTrainingEvent: { ...newTrainingEvent }
      })
    }

    // TODO: make this real owner id
    newTrainingEvent.ownerId = 1;

    // Save to db
    let body;
    try {
      body = await prisma.trainingEvent.create({
        data: newTrainingEvent,
      })
    } catch (e) {
      console.error(e);
      return fail(500, {
        message: "There was an error on our end. Please try again later.",
        newTrainingEvent: { ...newTrainingEvent }
      })
    }

    return body;
  }
};
