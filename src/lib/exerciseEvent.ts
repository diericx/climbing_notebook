export class ExerciseEventFormData {
  constructor(
    public date: string = "",
    public name: string = "",
    public weight: number = 0,
    public difficulty: number = 0,
    public notes: string = "",
  ) { }

  // Create an Exercise from an object 
  static fromObject({ date, name, weight, difficulty, notes }): ExerciseEventFormData {
    return Object.assign(new ExerciseEventFormData(), {
      date,
      name,
      weight: Number(weight),
      difficulty: Number(difficulty),
      notes,
    });
  }

  validate() {
    if (!this.name || this.name == "") {
      return {
        isValid: false,
        message: "Name is required."
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

