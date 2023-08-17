import Prisma from '@prisma/client';
import { Prisma as _Prisma } from '@prisma/client';

const PrismaClient = Prisma.PrismaClient;
export default PrismaClient;

export const prisma = new PrismaClient();
