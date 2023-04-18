import type { JournalEntry as _JournalEntry } from "@prisma/client";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { isNaN } from "mathjs";

export class JournalEntryFormData {
  date: Date = new Date();
  content: string = "";
  type: string = "";

  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { date, content, type } = obj;
    this.date = date == undefined ? this.date : new Date(date);
    this.content = content == undefined ? this.content : content;
    this.type = type == undefined ? this.type : type;
  }

  validate() {
    if (isNaN(this.date.valueOf())) {
      return {
        isValid: false,
        message: "Invalid date."
      }
    }
    if (this.content == "") {
      return {
        isValid: false,
        message: "Content is required."
      }
    }
    if (this.type == "") {
      return {
        isValid: false,
        message: "Type is required."
      }
    }

    return {
      isValid: true,
      message: "",
    }
  }
}

export const journalEntryActions: Actions = {
  newJournalEntry: async ({ fetch, request, url }) => {
    const formData = Object.fromEntries((await request.formData()).entries());

    const response = await fetch("/api/journalEntry", {
      method: "POST",
      body: JSON.stringify(formData),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        journalEntryFormData: formData
      })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },

  editJournalEntry: async ({ request, fetch, params, url }) => {
    const formData = Object.fromEntries((await request.formData()).entries());
    const { id } = params;

    const response = await fetch(`/api/journalEntry/${id}`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        journalEntryFormData: formData,
      })
    }

    if (url.searchParams.has('redirectTo')) {
      throw redirect(303, url.searchParams.get('redirectTo') || '/');
    }

    return { success: true };
  },

  deleteJournalEntry: async ({ fetch, request, url }) => {
    const formData = Object.fromEntries((await request.formData()).entries());

    const response = await fetch(`/api/journalEntry/${formData.id}`, {
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
}
