export class ExerciseEventFormData {
  constructor(
    public date?: string,
    public name: string = "",
    public weight: number = 0,
    public difficulty?: number,
    public notes: string = "",
    public trainingProgramDayId?: number
  ) { }

  // Create an Exercise from an object 
  static fromObject({ date, name, weight, difficulty, notes, trainingProgramDayId }): ExerciseEventFormData {
    return Object.assign(new ExerciseEventFormData(), {
      date,
      name,
      weight: Number(weight),
      difficulty: Number(difficulty) || undefined,
      notes,
      trainingProgramDayId
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
    if (this.date && isNaN(Date.parse(this.date))) {
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

