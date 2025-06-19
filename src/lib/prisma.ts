// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // 개발 중 로그 출력 (선택)
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
