export class JournalEntryInput {
  constructor(
    public date: string = "",
    public content: string = "",
    public type: string = "",
  ) { }

  // Create a TrainingEvent from an object 
  static fromObject({ date, content, type }): JournalEntryInput {
    return Object.assign(new JournalEntryInput(), {
      date: new Date(Date.parse(date)),
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

    return {
      isValid: true,
      message: "",
    }
  }
}

