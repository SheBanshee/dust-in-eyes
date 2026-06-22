/** Подставляет публичные URL Neon/Vercel, если DATABASE_URL указывает на localhost или Railway internal. */
export function setupDatabaseEnv(): void {
  const isLocalOrInternal = (url?: string) =>
    !url ||
    url.includes(".railway.internal") ||
    url.includes("localhost") ||
    url.includes("127.0.0.1");

  const pooled =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL;

  const direct =
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.DATABASE_URL;

  if (isLocalOrInternal(process.env.DATABASE_URL) && pooled) {
    process.env.DATABASE_URL = pooled;
  }

  if (isLocalOrInternal(process.env.DATABASE_URL_UNPOOLED) && direct) {
    process.env.DATABASE_URL_UNPOOLED = direct;
  }

  if (!process.env.DATABASE_URL_UNPOOLED && process.env.DATABASE_URL) {
    process.env.DATABASE_URL_UNPOOLED = process.env.DATABASE_URL;
  }
}

export function getMigrateDatabaseUrl(): string {
  setupDatabaseEnv();
  return (
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    ""
  );
}
