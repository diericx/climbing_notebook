import { fail, redirect, type Actions } from "@sveltejs/kit";

export class TrainingProgramFormData {
  name: string = "";

  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { name } = obj;
    this.name = name == undefined ? this.name : name;
  }

  validate() {
    if (this.name == "") {
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

export const trainingProgramActions: Actions = {
  newTrainingProgram: async ({ fetch, request, url }) => {
    const formData = Object.fromEntries((await request.formData()).entries());

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

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return data;
  },

  deleteTrainingProgram: async ({ fetch, request, url }) => {
    const formData = Object.fromEntries((await request.formData()).entries());

    const response = await fetch(`/api/trainingProgram/${formData.id}`, {
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

  patchTrainingProgram: async ({ fetch, request, url }) => {
    const formData = Object.fromEntries((await request.formData()).entries());

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

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return data;
  }
}
