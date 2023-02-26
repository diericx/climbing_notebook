import type { ExerciseEventFormData } from "./exerciseEvent";
import { Prisma } from "@prisma/client";

export class TrainingProgramDayFormData {
  constructor(
    public description: string = "",
    public exercises: ExerciseEventFormData[] = [],
    // Underscore allows reading in but prevents sending to database as an id
    public _id?: number
  ) { }

  static fromObject({ dayOfTheWeek, description, exercises, id }): TrainingProgramDayFormData {
    return Object.assign(new TrainingProgramDayFormData(), {
      dayOfTheWeek: Number(dayOfTheWeek),
      description,
      // this simple insertion will most likely not work
      exercises,
      _id: id,
    });
  }
}

const trainingProgramDayWithExercises = Prisma.validator<Prisma.TrainingProgramDayArgs>()({
  include: {
    exercises: true,
  },
})
export type TrainingProgramDayWithExercises = Prisma.TrainingProgramDayGetPayload<typeof trainingProgramDayWithExercises>
