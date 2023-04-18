import { fail, redirect, type Actions } from "@sveltejs/kit";
import { SERVER_ERROR } from "./helperTypes";

export class ProfileFormData {
  goals: string = "";
  activeTrainingProgramId: number | undefined;

  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { goals, activeTrainingProgramId } = obj;
    this.goals = goals == undefined ? this.goals : goals;
    this.activeTrainingProgramId = activeTrainingProgramId == undefined ? this.activeTrainingProgramId : Number(activeTrainingProgramId);
  }

  validate() {
    return {
      isValid: true,
      message: "",
    }
  }
}

export const profileActions: Actions = {
  editProfile: async ({ fetch, locals, request, url }) => {
    const formData = Object.fromEntries((await request.formData()).entries());

    // Protected page, safe to assume user exists
    let { user } = await locals.validateUser();

    const response = await fetch(`/api/profile/${user?.userId}`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    })
    const data = await response.json();

    if (!response.ok) {
      console.error(response.text())
      return fail(response.status, {
        message: SERVER_ERROR,
        userFormData: formData,
      })
    }


    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return data;
  }
}
