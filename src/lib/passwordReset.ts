
import type { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { APIError } from './errors';

export class PasswordResetRepo {
  constructor(private readonly prisma: PrismaClient) { }

  async canResetPassword(token: string) {
    const pr = await this.prisma.authPasswordReset.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      }
    })
    if (pr == null || pr.expires < new Date()) {
      return { isValid: false, token: pr };
    } else {
      return { isValid: true, token: pr };
    }
  }

  async newTokenForUser(email: string) {
    const user = await this.prisma.authUser.findUnique({
      where: {
        email: email,
      }
    })
    if (user == null) {
      throw new APIError('NOT_FOUND', 'User not found')
    }

    await this.prisma.authPasswordReset.deleteMany({
      where: {
        userId: user.id,
      }
    })
    return await this.prisma.authPasswordReset.create({
      data: {
        userId: user.id,
        expires: dayjs().add(1, 'hour').toDate()
      }
    })
  }

  async delete(userId: string) {
    return await this.prisma.authPasswordReset.delete({
      where: {
        userId,
      }
    })
  }
}
