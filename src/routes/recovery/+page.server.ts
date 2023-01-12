import { json, error } from '@sveltejs/kit';

let events = []

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  let recoveryEvents = []
  let trainingEvents = []
  let recoveryPoints = 0
  let trainingPoints = 0
  for (const item of events) {
    if (item.type == "recovery") {
      recoveryEvents.push(item)
      recoveryPoints += item.pointsPerUnit * item.amount
    } else {
      trainingEvents.push(item)
      trainingPoints += item.pointsPerUnit * item.amount
    }
  }
  return {trainingEvents, trainingPoints, recoveryEvents, recoveryPoints, events}
}

/** @type {import('./$types').Actions} */
export const actions = {
  addRecoveryItem: async ({cookies, request}) => {
    const data = await request.formData();
    const type = data.get('type');
    const label = data.get('label');
    const amount = data.get('amount');
    const amountUnit = data.get('amountUnit');
    const pointsPerUnit = Number(data.get('pointsPerUnit'));
    const date = data.get('date');

    events.push({type, label, amount, amountUnit, pointsPerUnit, date})
  }
};
