import { Prisma } from "@prisma/client";
import { TrainingProgramDayFormData } from "./trainingProgramDay";

export class TrainingProgramFormData {
  constructor(
    public name: string = "",
    public days: TrainingProgramDayFormData[] = []
  ) {
    if (this.days.length == 0) {
      for (let i = 0; i < 7; i++) {
        days.push(new TrainingProgramDayFormData())
      }
    }
  }

  // Create from an object 
  static fromObject({ name, days }): TrainingProgramFormData {
    return Object.assign(new TrainingProgramFormData(), {
      name,
      days
    });
  }

  validate() {
    return {
      isValid: true,
      message: "",
    }
  }
}

