import { ExerciseEventFormData } from "./exerciseEvent";
import type { PrismaClient, TrainingProgram } from "@prisma/client";
import { error } from "@sveltejs/kit";
import { SERVER_ERROR } from "./helperTypes";

export class TrainingProgramFormData {
  constructor(
    public name: string = "",
    public days: TrainingProgramDayFormData[]
  ) { }

  // Create from an object 
  static fromObject({ name, days }): TrainingProgramFormData {
    return Object.assign(new TrainingProgramFormData(), {
      name,
      days
    });
  }

  validate() {
    if (this.days.length != 7) {
      return {
        isValid: false,
        message: "Must have 7 days in a training program."
      }
    }

    return {
      isValid: true,
      message: "",
    }
  }
}

export class TrainingProgramDayFormData {
  constructor(
    public description: string = "",
    public exercises: ExerciseEventFormData[] = [],
  ) { }

  static fromObject({ dayOfTheWeek, description, exercises }): TrainingProgramFormData {
    return Object.assign(new TrainingProgramFormData(), {
      dayOfTheWeek: Number(dayOfTheWeek),
      description,
      // this simple insertion will most likely not work
      exercises,
    });
  }
}
