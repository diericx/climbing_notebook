export class ProfileFormData {
  constructor(
    public goals: string = "",
    public activeTrainingProgramId?: number
  ) { }

  // Create a TrainingEvent from an object 
  static fromObject({ goals, activeTrainingProgramId }): UserFormData {
    return Object.assign(new ProfileFormData(), {
      goals,
      activeTrainingProgramId: Number(activeTrainingProgramId) || undefined
    });
  }

  validate() {
    return {
      isValid: true,
      message: "",
    }
  }
}

