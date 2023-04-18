export class ProfileFormData {
  goals: string = "";
  activeTrainingProgramId: number | undefined;

  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { goals, activeTrainingProgramId } = obj;
    this.goals = goals == undefined ? this.goals : goals;
    this.activeTrainingProgramId = activeTrainingProgramId == undefined ? this.activeTrainingProgramId : Number(activeTrainingProgramId);
  }

  validate() {
    return {
      isValid: true,
      message: "",
    }
  }
}
