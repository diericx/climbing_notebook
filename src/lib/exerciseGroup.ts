export class ExerciseGroupFormData {
  name: string | undefined = undefined;

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { name } = obj;
    this.name = name;
  }

  validate() {
    if (!this.name || this.name == '') {
      return {
        isValid: false,
        message: 'Name is required.'
      }
    }

    return {
      isValid: true,
      message: '',
    }
  }
}
