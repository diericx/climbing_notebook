import type { Chart, PrismaClient } from "@prisma/client";
import { APIError } from "./errors";

export class ChartFormData {
  date: Date = new Date();
  name: string = "";
  type: string = "";
  patternToMatch: string = "";
  matchAgainst: string = "";
  equation: string = "";

  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { date, name, type, patternToMatch, matchAgainst, equation } = obj;
    this.date = date == undefined ? this.date : new Date(date);
    this.name = name == undefined ? this.name : name;
    this.type = type == undefined ? this.type : type;
    this.patternToMatch = patternToMatch == undefined ? this.patternToMatch : patternToMatch;
    this.matchAgainst = matchAgainst == undefined ? this.matchAgainst : matchAgainst;
    this.equation = equation == undefined ? this.equation : equation;
  }

  validate() {
    if (!this.name || this.name == "") {
      return {
        isValid: false,
        message: "Name is required."
      }
    }
    if (!this.type || this.type == "") {
      return {
        isValid: false,
        message: "Type is required."
      }
    }
    if (!this.matchAgainst || this.matchAgainst == "") {
      return {
        isValid: false,
        message: "Match against is required."
      }
    }
    if (!this.equation || this.equation == "") {
      return {
        isValid: false,
        message: "Equation is required."
      }
    }
    return {
      isValid: true,
      message: "",
    }
  }
}


export class ChartRepo {
  constructor(private readonly prisma: PrismaClient) { }

  async getOneAndValidateOwner(id: number, ownerId: number): Promise<Chart> {
    let chart = await this.prisma.chart.findUnique({
      where: {
        id: Number(id),
      }
    }) as Chart;
    if (chart == null) {
      throw new APIError("NOT_FOUND", "Resource not found");
    }
    if (chart?.ownerId != ownerId) {
      throw new APIError("INVALID_PERMISSIONS", "You do not have permission to edit this object.")
    }
    return chart
  }

  async new(data: ChartFormData, ownerId: number): Promise<Chart> {
    return await this.prisma.chart.create({
      data: {
        name: data.name,
        type: data.type,
        patternToMatch: data.patternToMatch,
        matchAgainst: data.matchAgainst,
        equation: data.equation,
        ownerId: ownerId,
      }
    }) as Chart;
  }

  async get(ownerId: number): Promise<Chart[]> {
    // Fetch all
    return await this.prisma.chart.findMany({
      where: {
        ownerId: ownerId,
      },
      orderBy: {
        name: 'desc',
      },
    }) as Chart[];
  }

  async getOne(id: number, ownerId: number): Promise<Chart> {
    return this.getOneAndValidateOwner(id, ownerId)
  }

  async update(data: ChartFormData, id: number, ownerId: number): Promise<Chart> {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.chart.update({
      data: {
        name: data.name,
        type: data.type,
        patternToMatch: data.patternToMatch,
        matchAgainst: data.matchAgainst,
        equation: data.equation,
      },
      where: {
        id: Number(id),
      },
    });
  }

  async delete(id: number, ownerId: number): Promise<Chart> {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.chart.delete({
      where: {
        id: Number(id)
      }
    })
  }

}

