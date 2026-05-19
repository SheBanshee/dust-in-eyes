import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Пробуем разные возможные имена переменных от Vercel
const databaseUrl = 
  process.env.STORAGE_POSTGRES_URL ||      // от интеграции Vercel+Neon
  process.env.DATABASE_URL ||               // стандартное имя
  process.env.POSTGRES_URL ||               // другой вариант
  process.env.DIRECT_URL;                   // fallback

if (!databaseUrl) {
  console.error("❌ No database URL found in environment variables");
  console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes('POSTGRES') || k.includes('DATABASE')));
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: databaseUrl,
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;