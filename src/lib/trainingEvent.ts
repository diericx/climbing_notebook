import type { TrainingEvent as Prisma_TrainingEvent } from "@prisma/client";

export type ValidationResponse = {
  isValid: boolean,
  message: string,
}

export class TrainingEvent implements Prisma_TrainingEvent {
  constructor(
    public id: number,
    public createdAt: Date,
    public date: Date,
    public label: string,
    public amount: number,
    public amountUnit: string,
    public pointsPerUnit: number,
    public type: string,
    public ownerId: number,
  ) { }

  static fromFormData(data: FormData): TrainingEvent {
    return new TrainingEvent(
      Number(data.get("id")),
      new Date(),
      new Date(data.get("date")!.toString()),
      data.get("label")!.toString(),
      Number(data.get("amount")),
      data.get("amountUnit")!.toString(),
      Number(data.get("pointsPerUnit")),
      data.get("type")!.toString(),
      Number(data.get("ownerId")),
    )
  }

  static newEmpty(): TrainingEvent {
    return new TrainingEvent(
      0,
      new Date(),
      new Date(),
      "",
      0,
      "",
      0,
      "",
      0,
    )
  }

  public validate(): ValidationResponse {
    if (!this.date) {
      return { isValid: false, message: "Date is required." };
    }
    if (!this.label || this.label == "") {
      return { isValid: false, message: "Label is required." };
    }
    if (!this.amount || this.amount == 0) {
      return { isValid: false, message: "Amount must be greater than 0." };
    }
    if (!this.amountUnit || this.amountUnit == "") {
      return { isValid: false, message: "Amount Unit is required." };
    }
    if (!this.pointsPerUnit || this.pointsPerUnit == 0) {
      return { isValid: false, message: "Points Per Unit is required." };
    }
    if (!this.type || this.type == "") {
      return { isValid: false, message: "Type is required." };
    }

    return { isValid: true, message: "" };
  }

  public isValid(): boolean {
    return this.validate().isValid;
  }

  public validationMessage(): string {
    return this.validate().message;
  }

}

