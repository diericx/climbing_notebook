import { fail, redirect, type Action, type Actions } from "@sveltejs/kit"
import { enhancedFormAction, toNum } from "./utils"

export class ChartFormData {
  date: Date = new Date();
  name: string = "";
  type: string = "";
  patternToMatch: string = "";
  matchAgainst: string = "";
  equation: string = "";

  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { date, name, type, patternToMatch, matchAgainst, equation } = obj;
    this.date = date == undefined ? this.date : new Date(date);
    this.name = name == undefined ? this.name : name;
    this.type = type == undefined ? this.type : type;
    this.patternToMatch = patternToMatch == undefined ? this.patternToMatch : patternToMatch;
    this.matchAgainst = matchAgainst == undefined ? this.matchAgainst : matchAgainst;
    this.equation = equation == undefined ? this.equation : equation;
  }

  validate() {
    if (!this.name || this.name == "") {
      return {
        isValid: false,
        message: "Name is required."
      }
    }
    if (!this.type || this.type == "") {
      return {
        isValid: false,
        message: "Type is required."
      }
    }
    if (!this.matchAgainst || this.matchAgainst == "") {
      return {
        isValid: false,
        message: "Match against is required."
      }
    }
    if (!this.equation || this.equation == "") {
      return {
        isValid: false,
        message: "Equation is required."
      }
    }
    return {
      isValid: true,
      message: "",
    }
  }
}

export const chartActions: Actions = {
  newChart: async ({ fetch, request, url }) => {
    const formData = Object.fromEntries((await request.formData()).entries());

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

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },

  editChart: async ({ fetch, params, request, url }) => {
    const formData = Object.fromEntries((await request.formData()).entries());

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

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return data;
  },

  deleteChart: async ({ fetch, request, url }) => {
    const formData = Object.fromEntries((await request.formData()).entries());

    const response = await fetch(`/api/chart/${formData.id}`, {
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
  }
}
