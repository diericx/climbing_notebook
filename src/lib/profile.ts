import type { PrismaClient, Profile } from "@prisma/client";
import { APIError } from "./errors";
import type { ProfileWithActiveTrainingProgram } from "./prisma";

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

export class ProfileRepo {
  constructor(private readonly prisma: PrismaClient) { }

  async getOneAndValidateOwner(ownerId: number): Promise<ProfileWithActiveTrainingProgram> {
    // Fetch
    let profile = await this.prisma.profile.findUnique({
      where: {
        ownerId: ownerId,
      },
      include: {
        activeTrainingProgram: {
          include: {
            days: {
              include: {
                exercises: true,
                exerciseGroups: {
                  include: {
                    exercises: true,
                  },
                }
              },
              orderBy: {
                // Note: ui depends on this being sorted in this way
                dayOfTheWeek: 'asc',
              },
            },
          }
        }
      }
    }) as ProfileWithActiveTrainingProgram;
    if (profile == null) {
      throw new APIError("NOT_FOUND", "Resource not found");
    }
    if (profile?.ownerId != ownerId) {
      throw new APIError("INVALID_PERMISSIONS", "You do not have permission to edit this object.")
    }
    return profile
  }

  async getOne(ownerId: number): Promise<ProfileWithActiveTrainingProgram> {
    return this.getOneAndValidateOwner(ownerId)
  }

  async update(data: ProfileFormData, ownerId: number): Promise<ProfileWithActiveTrainingProgram> {
    await this.getOneAndValidateOwner(ownerId);

    return await this.prisma.profile.update({
      data: {
        // TODO: Don't deconstruct?
        ...data,
      },
      where: {
        ownerId,
      },
    }) as ProfileWithActiveTrainingProgram;
  }
}

