import type { JournalEntry, PrismaClient, User } from "@prisma/client";
import { isNaN } from "mathjs";
import { APIError } from "./errors";
import { matchMetricsInString, parseMetricStrings, toNum } from "./utils";

export class JournalEntryFormData {
  date: Date = new Date();
  content: string = "";
  type: string = "";

  constructor(obj: any | undefined = undefined) {
    if (obj == undefined) {
      return
    }
    const { date, content, type } = obj;
    this.date = date == undefined ? this.date : new Date(date);
    this.content = content == undefined ? this.content : content;
    this.type = type == undefined ? this.type : type;
  }

  validate() {
    if (isNaN(this.date.valueOf())) {
      return {
        isValid: false,
        message: "Invalid date."
      }
    }
    if (this.content == "") {
      return {
        isValid: false,
        message: "Content is required."
      }
    }
    if (this.type == "") {
      return {
        isValid: false,
        message: "Type is required."
      }
    }

    return {
      isValid: true,
      message: "",
    }
  }
}

export class JournalEntryRepo {
  constructor(private readonly prisma: PrismaClient) { }
  async new(data: JournalEntryFormData, ownerId: number): Promise<JournalEntry> {
    // Fetch journalEntries with same day to validate this is a new date
    let journalEntries: JournalEntry[] = await this.prisma.journalEntry.findMany({
      where: {
        ownerId,
        date: new Date(data.date),
      },
    }) as JournalEntry[];
    if (journalEntries.length > 0) {
      throw new APIError("UNIQUENESS_COLLISION", "A journal entry for that date already exists")
    }

    // Add new journal entry
    let journalEntry: JournalEntry = await this.prisma.journalEntry.create({
      data: {
        ...data,
        date: new Date(data.date),
        ownerId: ownerId,
        createdAt: new Date(),
      },
    }) as JournalEntry;

    let metrics = parseMetricStrings(matchMetricsInString(data.content))
    await this.prisma.metric.createMany({
      data: metrics.map(m => ({
        name: m.name,
        // Number parse is implied succesful with regex match?
        value: toNum(m.value, 0),
        date: new Date(data.date),
        journalEntryId: Number(journalEntry.id),
        ownerId: ownerId
      })
      )
    })

    return journalEntry;
  }

  async get(ownerId: number): Promise<JournalEntry[]> {
    return await this.prisma.journalEntry.findMany({
      where: {
        ownerId: Number(ownerId),
      },
      orderBy: {
        date: 'desc',
      },
    }) as JournalEntry[];
  }

  async getOne(id: number, ownerId: number): Promise<JournalEntry> {
    const journalEntry = await this.prisma.journalEntry.findUnique({
      where: {
        id
      }
    });
    if (journalEntry == null) {
      throw new APIError("NOT_FOUND", "Resource not found");
    }
    if (journalEntry?.ownerId != ownerId) {
      throw new APIError("INVALID_PERMISSIONS", "You do not have permission to edit this object.")
    }

    return journalEntry;
  }

  async update(data: JournalEntryFormData, id: number, ownerId: number): Promise<JournalEntry> {
    const journalEntry = await this.prisma.journalEntry.findUnique({
      where: {
        id
      }
    });
    if (journalEntry == null) {
      throw new APIError("NOT_FOUND", "Resource not found");
    }
    if (journalEntry?.ownerId != ownerId) {
      throw new APIError("INVALID_PERMISSIONS", "You do not have permission to edit this object.")
    }

    return await this.prisma.journalEntry.update({
      data: {
        date: new Date(data.date),
        content: data.content,
        type: data.type,
      },
      where: {
        id: Number(id),
      },
    });
  }

  async delete(id: number, ownerId: number): Promise<JournalEntry> {
    const journalEntry = await this.prisma.journalEntry.findUnique({
      where: {
        id
      }
    });
    if (journalEntry == null) {
      throw new APIError("NOT_FOUND", "Resource not found");
    }
    if (journalEntry?.ownerId != ownerId) {
      throw new APIError("INVALID_PERMISSIONS", "You do not have permission to edit this object.")
    }

    return await this.prisma.journalEntry.delete({
      where: {
        id
      }
    });
  }

}

