import { ExerciseEventFormData } from "./exerciseEvent";
import type { PrismaClient, TrainingProgram } from "@prisma/client";
import { error } from "@sveltejs/kit";
import { SERVER_ERROR } from "./helperTypes";

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
    // Underscore allows reading in but prevents sending to database as an id
    public _id?: number
  ) { }

  static fromObject({ dayOfTheWeek, description, exercises, id }): TrainingProgramFormData {
    return Object.assign(new TrainingProgramFormData(), {
      dayOfTheWeek: Number(dayOfTheWeek),
      description,
      // this simple insertion will most likely not work
      exercises,
      _id: id,
    });
  }
}
