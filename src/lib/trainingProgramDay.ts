
export class TrainingProgramDayFormData {
  description: string | undefined = '';

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { description } = obj;
    this.description = description == undefined ? this.description : description;
  }

}
