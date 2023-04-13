import { fail, type Action, type Actions } from "@sveltejs/kit"
import { enhancedFormAction, toNum } from "./utils"

export class ExerciseEventFormData {
  public date?: string
  public name: string = ""
  public sets: number = 0
  public reps: number = 0
  public weight: number = 0
  public difficulty?: number
  public notes: string = ""
  public trainingProgramDayId?: number

  constructor(params) {
    if (params == undefined) {
      return
    }
    const { difficulty } = params;
    this.difficulty = difficulty;
  }

  // Create an Exercise from an object 
  static fromObject({ date, name, sets, reps, weight, difficulty, notes, trainingProgramDayId }): ExerciseEventFormData {
    return Object.assign(new ExerciseEventFormData(), {
      date,
      name,
      sets: toNum(sets, 0),
      reps: toNum(reps, 0),
      weight: toNum(weight, 0),
      difficulty: toNum(difficulty, undefined),
      notes,
      trainingProgramDayId: toNum(trainingProgramDayId, undefined)
    });
  }

  validate() {
    if (!this.name || this.name == "") {
      return {
        isValid: false,
        message: "Name is required."
      }
    }
    // Validate date string
    if (this.date && isNaN(Date.parse(this.date))) {
      return {
        isValid: false,
        message: "Invalid date"
      }
    }

    if (this.trainingProgramDayId == undefined && this.difficulty == undefined) {
      return {
        isValid: false,
        message: "Difficulty is required"
      }
    }

    return {
      isValid: true,
      message: "",
    }
  }
}

export const exerciseEventActions: Actions = {
  newExerciseEvent: enhancedFormAction((async ({ fetch, formData }) => {
    const response = await fetch("/api/exerciseEvent", {
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
  }) satisfies Action),

  deleteExerciseEvent: enhancedFormAction((async ({ fetch, formData }) => {
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
  }) satisfies Action)
}
