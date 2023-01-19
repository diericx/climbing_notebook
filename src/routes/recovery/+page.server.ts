import { TrainingEvent } from "$lib/trainingEvents";
import type { Actions, RequestEvent } from "./$types";

const events: TrainingEvent = [];

/** @type {import('./$types').PageServerLoad} */
export function load() {
  const recoveryEvents: TrainingEvent = [];
  const trainingEvents: TrainingEvent = [];
  let recoveryPoints = 0;
  let trainingPoints = 0;
  for (const item of events) {
    if (item.type == "recovery") {
      recoveryEvents.push(item);
      recoveryPoints += item.pointsPerUnit * item.amount;
    } else {
      trainingEvents.push(item);
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
  addRecoveryItem: async (event: RequestEvent) => {
    const data = await event.request.formData();
    const type = data.get("type");
    const label = data.get("label");
    const amount = data.get("amount");
    const amountUnit = data.get("amountUnit");
    const pointsPerUnit = Number(data.get("pointsPerUnit"));
    const date = data.get("date");

    events.push({ type, label, amount, amountUnit, pointsPerUnit, date });
  },
};
