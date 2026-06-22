// lib/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const DEMO_ADMIN_EMAIL = "admin123@mail.com";
const DEMO_ADMIN_PASSWORD = "admin123";

async function getOrCreateDemoAdmin() {
  const hashedPassword = await bcrypt.hash(DEMO_ADMIN_PASSWORD, 10);

  return prisma.user.upsert({
    where: { email: DEMO_ADMIN_EMAIL },
    update: { role: "ADMIN", password: hashedPassword },
    create: {
      email: DEMO_ADMIN_EMAIL,
      name: "Администратор",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;

          // Демо-доступ: любой email + пароль admin123 → вход как админ
          if (password === DEMO_ADMIN_PASSWORD) {
            const admin = await getOrCreateDemoAdmin();
            return {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: "ADMIN",
            };
          }

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            return null;
          }

          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Ошибка в authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || "USER";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});