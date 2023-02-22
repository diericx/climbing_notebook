export class ProfileFormData {
  constructor(
    public goals: string = "",
  ) { }

  // Create a TrainingEvent from an object 
  static fromObject({ goals }): UserFormData {
    return Object.assign(new ProfileFormData(), {
      goals
    });
  }

  validate() {
    return {
      isValid: true,
      message: "",
    }
  }
}

