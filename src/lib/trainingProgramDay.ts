import type { ExerciseEventFormData } from "./exerciseEvent";
import { Prisma } from "@prisma/client";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { enhancedFormAction } from "./utils";

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

export const trainingProgramDayActions: Actions = {
  editTrainingProgramDay: enhancedFormAction(async ({ fetch, params, formData }) => {
    const { id } = params;

    const response = await fetch(`/api/trainingProgramDay/${id}`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        trainingProgramDayFormData: formData,
      })
    }

    return data;
  }),
}
