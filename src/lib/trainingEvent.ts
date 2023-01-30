export class TrainingEventInput {
  constructor(
    public date: string = "",
    public label: string = "",
    public amount: number = 0,
    public amountUnit: string = "",
    public pointsPerUnit: number = 0,
    public type: string = "",
  ) { }

  // Create a TrainingEvent from an object 
  static fromObject({ date, label, amount, amountUnit, pointsPerUnit, type }): TrainingEventInput {
    return Object.assign(new TrainingEventInput(), {
      date: new Date(Date.parse(date)),
      label,
      amount: Number(amount),
      amountUnit,
      pointsPerUnit: Number(pointsPerUnit),
      type,
    });
  }

  validate() {
    if (!this.label || this.label == "") {
      return {
        isValid: false,
        message: "A label is required."
      }
    }
    if (!this.amount || this.amount == 0 || isNaN(Number(this.amount))) {
      return {
        isValid: false,
        message: "An number amount is required and must be greater than 0."
      }
    }
    if (!this.amountUnit || this.amountUnit == "") {
      return {
        isValid: false,
        message: "An amount unit is required."
      }
    }
    if (!this.pointsPerUnit || this.pointsPerUnit == 0 || isNaN(Number(this.pointsPerUnit))) {
      return {
        isValid: false,
        message: "A number points per unit is required and must be greater than 0."
      }
    }
    if (!this.type || this.type == "") {
      return {
        isValid: false,
        message: "A type is required."
      }
    }
    // Validate date string
    if (isNaN(Date.parse(this.date))) {
      return {
        isValid: false,
        message: "Invalid date."
      }
    }

    return {
      isValid: true,
      message: "",
    }
  }
}

