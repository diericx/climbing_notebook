import { fail, redirect, type Actions } from "@sveltejs/kit"
import { toNum } from "./utils"

export class ExerciseEventFormData {
  date: Date = new Date();
  name: string = "";
  sets: number = 0;
  reps: number = 0;
  weight: number = 0;
  seconds: number = 0;
  minutes: number = 0;
  difficulty: number = 0;
  notes: string = "";

  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { date, name, sets, reps, weight, seconds, minutes, difficulty, notes } = obj;
    this.date = date == undefined ? this.date : new Date(date);
    this.name = name == undefined ? this.name : name;
    this.sets = sets == undefined ? this.sets : toNum(sets, 0);
    this.reps = reps == undefined ? this.reps : toNum(reps, 0);
    this.weight = weight == undefined ? this.weight : toNum(weight, 0);
    this.seconds = seconds == undefined ? this.seconds : toNum(seconds, 0);
    this.minutes = minutes == undefined ? this.minutes : toNum(minutes, 0);
    this.difficulty = difficulty == undefined ? this.difficulty : toNum(difficulty, 0);
    this.notes = notes == undefined ? this.notes : notes;
  }

  validate() {
    if (isNaN(this.date.valueOf())) {
      return {
        isValid: false,
        message: "Invalid date."
      }
    }

    if (!this.name || this.name == "") {
      return {
        isValid: false,
        message: "Name is required."
      }
    }

    return {
      isValid: true,
      message: "",
    }
  }
}

export const exerciseEventActions: Actions = {
  newExerciseEvent: async ({ fetch, request, url }) => {
    const formData = Object.fromEntries((await request.formData()).entries());

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

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },

  deleteExerciseEvent: async ({ fetch, request, url }) => {
    const formData = Object.fromEntries((await request.formData()).entries());

    const response = await fetch(`/api/exerciseEvent/${formData.id}`, {
      method: "DELETE",
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
      })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return data;
  },

  editExerciseEvent: async ({ fetch, params, request, url }) => {
    const formData = Object.fromEntries((await request.formData()).entries());
    const { id } = params;

    const response = await fetch(`/api/exerciseEvent/${id}`, {
      method: "PATCH",
      body: JSON.stringify(formData)
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        exerciseEventFormData: formData
      })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return data;
  }
}
