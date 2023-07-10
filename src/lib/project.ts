import type { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';
import { fontGrades, gradeSystems, huecoGrades } from './utils';

export const projectSchema = z.object({
  name: z.string().min(1),
  fontGrade: z.enum(fontGrades).nullish(),
  huecoGrade: z.enum(huecoGrades).nullish(),
  gradeSystem: z.enum(gradeSystems),
  url: z.string().nullish(),
  imageS3ObjectKey: z.string().nullish()
});
export type ProjectSchema = typeof projectSchema;

export const projectPartialSchema = z.object({
  name: z.string().min(1).optional(),
  fontGrade: z.enum(fontGrades).optional(),
  huecoGrade: z.enum(huecoGrades).optional(),
  gradeSystem: z.enum(gradeSystems).optional(),
  url: z.string().nullish().optional(),
  imageS3ObjectKey: z.string().optional()
});
export type ProjectPartialSchema = typeof projectPartialSchema;

export const projectSessionSchema = z.object({
  notes: z.string().nullish(),
  date: z.date(),
  sent: z.boolean().default(false)
});
export type ProjectSessionSchema = typeof projectSessionSchema;

export class ProjectRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async getOneAndValidateOwner(id: string, ownerId: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: id
      },
      include: {
        sessions: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    });
    if (project == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    if (project.ownerId != ownerId) {
      throw new APIError('INVALID_PERMISSIONS', 'You do not have permission to edit this object.');
    }
    return project;
  }

  async new(data: z.infer<ProjectSchema>, ownerId: string) {
    return await this.prisma.project.create({
      data: {
        ...data,
        ownerId,
        createdAt: new Date()
      }
    });
  }

  async get(ownerId: string) {
    // Fetch all
    return await this.prisma.project.findMany({
      where: {
        ownerId: ownerId
      },
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        sessions: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    });
  }

  async getOne(id: string, ownerId: string) {
    return this.getOneAndValidateOwner(id, ownerId);
  }

  async update(data: z.infer<ProjectPartialSchema>, id: string, ownerId: string) {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.project.update({
      data: {
        ...data,
        updatedAt: new Date()
      },
      where: {
        id: id
      }
    });
  }

  async delete(id: string, ownerId: string) {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.project.delete({
      where: {
        id: id
      }
    });
  }

  async addSession(data: z.infer<ProjectSessionSchema>, projectId: string, ownerId: string) {
    await this.getOneAndValidateOwner(projectId, ownerId);
    return await this.prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        updatedAt: new Date(),
        sessions: {
          create: {
            ...data,
            owner: {
              connect: {
                id: ownerId
              }
            }
          }
        }
      }
    });
  }

  async deleteSession(projectId: string, sessionId: string, ownerId: string) {
    await this.getOneAndValidateOwner(projectId, ownerId);
    return await this.prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        updatedAt: new Date(),
        sessions: {
          delete: [{ id: sessionId }]
        }
      }
    });
  }

  async updateSession(
    data: z.infer<ProjectSessionSchema>,
    projectId: string,
    sessionId: string,
    ownerId: string
  ) {
    await this.getOneAndValidateOwner(projectId, ownerId);
    return await this.prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        updatedAt: new Date(),
        sessions: {
          update: {
            data: {
              ...data
            },
            where: {
              id: sessionId
            }
          }
        }
      }
    });
  }
}
