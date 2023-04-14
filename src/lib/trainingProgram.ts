import { Prisma } from "@prisma/client";
import { fail, type Actions } from "@sveltejs/kit";
import { TrainingProgramDayFormData } from "./trainingProgramDay";
import { enhancedFormAction } from "./utils";

export class TrainingProgramFormData {
  constructor(
    public name: string = "",
    public days: TrainingProgramDayFormData[] = [],
    // Underscore allows reading in but prevents sending to database as an id
    public _id?: number
  ) {
    if (this.days.length == 0) {
      for (let i = 0; i < 7; i++) {
        days.push(new TrainingProgramDayFormData())
      }
    }
  }

  // Create from an object 
  static fromObject({ name, days, id }): TrainingProgramFormData {
    return Object.assign(new TrainingProgramFormData(), {
      name,
      days,
      _id: id,
    });
  }

  validate() {
    return {
      isValid: true,
      message: "",
    }
  }
}

export const trainingProgramActions: Actions = {
  newTrainingProgram: enhancedFormAction(async ({ fetch, formData }) => {
    const response = await fetch("/api/trainingProgram", {
      method: "POST",
      body: JSON.stringify(formData),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        trainingProgramFormData: formData
      })
    }
    return data;
  }),

  deleteTrainingProgram: enhancedFormAction(async ({ fetch, formData }) => {
    const response = await fetch(`/api/trainingProgram/${formData.id}`, {
      method: "DELETE",
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
      })
    }

    return data;
  }),

  patchTrainingProgram: enhancedFormAction(async ({ fetch, formData }) => {
    const response = await fetch(`/api/trainingProgram/${formData.id}`, {
      method: "PATCH",
      body: formData.trainingProgram,
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
