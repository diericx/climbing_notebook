import type { PrismaClient } from '@prisma/client';
import type { z } from 'zod';
import { APIError } from '../../errors';
import type { ProjectPartialSchema, ProjectSchema, ProjectSessionSchema } from '../../zodSchemas';

export class ProjectRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async getOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: id,
      },
      include: {
        sessions: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });
    if (project == null) {
      throw new APIError('NOT_FOUND', 'Resource not found');
    }
    return project;
  }

  async getOneAndValidateOwner(id: string, ownerId: string) {
    const project = await this.getOne(id);
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
        createdAt: new Date(),
      },
    });
  }

  async get(ownerId: string) {
    // Fetch all
    return await this.prisma.project.findMany({
      where: {
        ownerId: ownerId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        sessions: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });
  }

  async update(data: z.infer<ProjectPartialSchema>, id: string, ownerId: string) {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.project.update({
      data: {
        ...data,
        updatedAt: new Date(),
      },
      where: {
        id: id,
      },
    });
  }

  async delete(id: string, ownerId: string) {
    await this.getOneAndValidateOwner(id, ownerId);

    return await this.prisma.project.delete({
      where: {
        id: id,
      },
    });
  }

  async addSession(data: z.infer<ProjectSessionSchema>, projectId: string, ownerId: string) {
    await this.getOneAndValidateOwner(projectId, ownerId);
    return await this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        updatedAt: new Date(),
        sessions: {
          create: {
            ...data,
            sent: data.sent || false,
            owner: {
              connect: {
                id: ownerId,
              },
            },
          },
        },
      },
    });
  }

  async deleteSession(projectId: string, sessionId: string, ownerId: string) {
    await this.getOneAndValidateOwner(projectId, ownerId);
    return await this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        updatedAt: new Date(),
        sessions: {
          delete: [{ id: sessionId }],
        },
      },
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
        id: projectId,
      },
      data: {
        updatedAt: new Date(),
        sessions: {
          update: {
            data: {
              ...data,
            },
            where: {
              id: sessionId,
            },
          },
        },
      },
    });
  }
}
