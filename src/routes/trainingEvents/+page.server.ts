import type { Actions } from "./$types";
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { TrainingEvent } from "@prisma/client";

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Protected page
  const session = await locals.validate();
  if (!session) {
    throw redirect(302, "/login?redirectTo=trainingEvents")
  }

  const response = await fetch("/api/trainingEvents", {
    method: "GET",
  })
  const data = await response.json();
  const trainingEvents = data.trainingEvents;
  const recoveryEvents: TrainingEvent[] = [];
  const workEvents: TrainingEvent[] = [];

  let recoveryPoints = 0;
  let workPoints = 0;
  for (const item of trainingEvents) {
    if (item.type == "recovery") {
      recoveryEvents.push(item as TrainingEvent);
      recoveryPoints += item.pointsPerUnit * item.amount;
    } else {
      workEvents.push(item as TrainingEvent);
      workPoints += item.pointsPerUnit * item.amount;
    }
  }

  return {
    workPoints,
    recoveryPoints,
    trainingEvents,
  };
}

export const actions: Actions = {
  new: async ({ request, fetch }) => {
    // Get trainingEvent from form data
    const formData = await request.formData();
    const input = Object.fromEntries(formData.entries());

    const response = await fetch("/api/trainingEvents", {
      method: "POST",
      body: JSON.stringify(input),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        trainingEventInput: input
      })
    }
    return data;
  }
};
