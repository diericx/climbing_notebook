import { fail, type Action, type Actions } from "@sveltejs/kit";
import { enhancedFormAction } from "./utils";

export class JournalEntryFormData {
  constructor(
    public date: string = "",
    public content: string = "",
    public type: string = "",
  ) { }

  // Create a TrainingEvent from an object 
  static fromObject({ date, content, type }): JournalEntryFormData {
    return Object.assign(new JournalEntryFormData(), {
      date,
      content,
      type,
    });
  }

  validate() {
    if (!this.content || this.content == "") {
      return {
        isValid: false,
        message: "Content is required."
      }
    }
    if (!this.type || this.type == "") {
      return {
        isValid: false,
        message: "Type is required."
      }
    }
    // Validate date string
    if (isNaN(Date.parse(this.date))) {
      return {
        isValid: false,
        message: "Invalid date"
      }
    }

    return {
      isValid: true,
      message: "",
    }
  }
}

export const journalEntryActions: Actions = {
  newJournalEntry: enhancedFormAction(async ({ fetch, formData }) => {
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
    return data;
  }),

  deleteJournalEntry: enhancedFormAction(async ({ fetch, formData }) => {
    const response = await fetch(`/api/journalEntry/${formData.id}`, {
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

  editJournalEntry: enhancedFormAction(async ({ request, fetch, params }) => {
    const { id } = params;

    // Get journalEntry from form data
    const formData = await request.formData();
    const input = Object.fromEntries(formData.entries());
    const { redirectTo } = input;

    const response = await fetch(`/api/journalEntry/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    })

    const data = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        message: data.message,
        journalEntryFormData: input,
        redirectTo
      })
    }

    if (redirectTo && redirectTo != "") {
      throw redirect(303, redirectTo)
    }

    return data;
  }),
}
