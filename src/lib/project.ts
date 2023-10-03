import type { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { APIError } from './errors';
import { grades, gradeSystems } from './utils';

const projectBaseSchema = z.object({
  name: z.string().min(1),
  grade: z.string(),
  gradeSystem: z.string(),
  url: z.string().nullish(),
  imageS3ObjectKey: z.string().nullish(),
});
export const projectPartialBaseSchema = projectBaseSchema.partial();

const projectSchemaChecks = (
  val: z.infer<typeof projectBaseSchema> | z.infer<typeof projectPartialBaseSchema>,
  ctx: z.RefinementCtx
) => {
  if (val.gradeSystem && !gradeSystems.includes(val.gradeSystem)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid grade system`,
      path: ['gradeSystem'],
    });
  }
  if (val.gradeSystem && val.grade && !grades[val.gradeSystem].includes(val.grade)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Grade is required and must be a valid grade for the selected system`,
      path: ['grade'],
    });
  }
};

export const projectSchema = projectBaseSchema.superRefine(projectSchemaChecks);
export type ProjectSchema = typeof projectSchema;

export const projectPartialSchema = projectPartialBaseSchema.superRefine(projectSchemaChecks);
export type ProjectPartialSchema = typeof projectPartialSchema;

export const projectSessionSchema = z.object({
  notes: z.string().nullish(),
  date: z.date(),
  sent: z.boolean().default(false).optional(),
});
export type ProjectSessionSchema = typeof projectSessionSchema;

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
