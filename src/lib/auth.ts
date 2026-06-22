// lib/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
          console.log("1. Начало authorize");
          
          if (!credentials?.email || !credentials?.password) {
            console.log("2. Нет email или пароля");
            return null;
          }

          console.log("3. Ищем пользователя:", credentials.email);
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          console.log("4. Найден пользователь?", !!user);

          if (!user || !user.password) {
            console.log("5. Пользователь не найден или нет пароля");
            return null;
          }

          console.log("6. Сравниваем пароли...");
          
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          
          console.log("7. Пароль верный?", isValid);

          if (!isValid) {
            console.log("8. Неверный пароль");
            return null;
          }

          console.log("9. Успешный вход!");
          
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