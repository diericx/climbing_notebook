import { fail, type Action, type Actions } from "@sveltejs/kit"
import { enhancedFormAction, toNum } from "./utils"

export class ChartFormData {
  public name: string = ""
  public patternToMatch: string = ""
  public matchAgainst: string = ""
  public equation: string = ""

  // Create an Exercise from an object 
  static fromObject({ name, patternToMatch, matchAgainst, equation }): ChartFormData {
    return Object.assign(new ChartFormData(), {
      name,
      patternToMatch,
      matchAgainst,
      equation,
    });
  }

  validate() {
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

export const chartActions: Actions = {
  newChart: enhancedFormAction((async ({ fetch, formData }) => {
    const response = await fetch("/api/chart", {
      method: "POST",
      body: JSON.stringify(formData),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        chartFormData: formData
      })
    }

    return data;
  }) satisfies Action),

  editChart: enhancedFormAction((async ({ fetch, formData, params }) => {
    const { id } = params;
    const response = await fetch(`/api/chart/${id}`, {
      method: "PATCH",
      body: JSON.stringify(formData)
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
      })
    }

    return data;
  }) satisfies Action),

  deleteChart: enhancedFormAction((async ({ fetch, formData, params }) => {
    const response = await fetch(`/api/chart/${formData.id}`, {
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
