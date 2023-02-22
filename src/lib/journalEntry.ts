export class JournalEntryFormData {
  constructor(
    public date: string = "",
    public content: string = "",
    public type: string = "",
  ) { }

  // Create a TrainingEvent from an object 
  static fromObject(object: JournalEntryFormData): JournalEntryFormData {
    return Object.assign(new JournalEntryFormData(), {
      date: object.date,
      content: object.content,
      type: object.type,
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

