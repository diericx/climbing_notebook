export class TrainingEvent {
  constructor(
    public label: string,
    public amount: number,
    public amountUnit: string,
    public pointsPerUnit: number,
    public type: string,
  ) {}
}

export class TrainingEventMaker {
  static create(e: TrainingEvent) {
    return new TrainingEvent(
      e.label,
      e.amount,
      e.amountUnit,
      e.pointsPerUnit,
      e.type,
    );
  }
}

export const presetTrainingEvents: TrainingEvent[] = [
  {
    label: "Bouldering",
    amountUnit: "hour",
    pointsPerUnit: 10,
    type: "work",
    amount: 0,
  },
  {
    label: "Hard Route Climbing",
    amountUnit: "hour",
    pointsPerUnit: 10,
    type: "work",
    amount: 0,
  },
  {
    label: "Weight Training",
    amountUnit: "hour",
    pointsPerUnit: 10,
    type: "work",
    amount: 0,
  },
  {
    label: "Easy Climbing (at OS level or below)",
    amountUnit: "hour",
    pointsPerUnit: 10,
    type: "work",
    amount: 0,
  },
  {
    label: "Sleep, hours before midnight",
    amountUnit: "hour",
    pointsPerUnit: 3,
    type: "recovery",
    amount: 0,
  },
  {
    label: "Post-training meal",
    amountUnit: "meal",
    pointsPerUnit: 2,
    type: "recovery",
    amount: 0,
  },
  {
    label: "Water",
    amountUnit: "liter",
    pointsPerUnit: 1,
    type: "recovery",
    amount: 0,
  },
  {
    label: "Nap",
    amountUnit: "nap",
    pointsPerUnit: 5,
    type: "recovery",
    amount: 0,
  },
  {
    label: "Easy Walk",
    amountUnit: "walk",
    pointsPerUnit: 2,
    type: "recovery",
    amount: 0,
  },
  {
    label: "Easy cycle",
    amountUnit: "walk",
    pointsPerUnit: 2,
    type: "recovery",
    amount: 0,
  },
  {
    label: "Hit Protein Goal",
    amountUnit: "protein goal reached",
    pointsPerUnit: 3,
    type: "recovery",
    amount: 0,
  },
  {
    label: "Stretch for 15 min",
    amountUnit: "stretch",
    pointsPerUnit: 1,
    type: "recovery",
    amount: 0,
  },
];
export let presetWorkTrainingEvents: TrainingEvent[] = presetTrainingEvents
  .filter((event) => event.type == "work");
export let presetRecoveryTrainingEvents: TrainingEvent[] = presetTrainingEvents
  .filter((event) => event.type == "recovery");
