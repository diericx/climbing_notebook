import { fail, redirect, type Actions } from "@sveltejs/kit";
import { SERVER_ERROR } from "./helperTypes";
import { enhancedFormAction } from "./utils";

export class ProfileFormData {
  constructor(
    public goals: string = "",
    public activeTrainingProgramId?: number
  ) { }

  // Create a TrainingEvent from an object 
  static fromObject({ goals, activeTrainingProgramId }): UserFormData {
    return Object.assign(new ProfileFormData(), {
      goals,
      activeTrainingProgramId: Number(activeTrainingProgramId) || undefined
    });
  }

  validate() {
    return {
      isValid: true,
      message: "",
    }
  }
}

export const profileActions: Actions = {
  editProfile: enhancedFormAction(async ({ fetch, locals, formData }) => {
    // Protected page, safe to assume user exists
    let { user } = await locals.validateUser();

    const response = await fetch(`/api/profile/${user?.userId}`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    })
    if (!response.ok) {
      console.error(response.text())
      return fail(response.status, {
        message: SERVER_ERROR,
        userFormData: formData,
      })
    }

    const data = await response.json();

    return data;
  }),
}
