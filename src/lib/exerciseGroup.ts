import { fail, type Actions } from "@sveltejs/kit";
import { enhancedFormAction, toNum } from "./utils";

export class ExerciseGroupFormData {
  constructor(
    public name: string = "",
    public trainingProgramId: number = 0,
    // Underscore allows reading in but prevents sending to database as an id
    public _id?: number
  ) { }

  validate() {
    if (this.trainingProgramId == undefined) {
      return {
        isValid: false,
        message: "Training program is required"
      }
    }

    return {
      isValid: true,
      message: "",
    }
  }

  static fromObject({ id, name, trainingProgramId }): ExerciseGroupFormData {
    return Object.assign(new ExerciseGroupFormData(), {
      name,
      trainingProgramDayId: toNum(trainingProgramId, undefined),
      _id: id,
    });
  }
}

export const exerciseGroupActions: Actions = {
  newExerciseGroup: enhancedFormAction(async ({ fetch, formData }) => {
    const response = await fetch("/api/exerciseGroup", {
      method: "POST",
      body: JSON.stringify(formData),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        exerciseEventFormData: formData
      })
    }

    return data;
  }),

  deleteExerciseGroup: enhancedFormAction(async ({ fetch, formData }) => {
    const response = await fetch(`/api/exerciseEvent/${formData.id}`, {
      method: "DELETE",
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
      })
    }

    return data;
  })
}
