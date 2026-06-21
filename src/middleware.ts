// src/middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = (session?.user as { role?: string })?.role;

  // Админ-панель — только ADMIN
  if (pathname.startsWith("/admin")) {
    if (!session || role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  // Менеджер-панель — MANAGER или ADMIN
  if (pathname.startsWith("/manager")) {
    if (!session || (role !== "MANAGER" && role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  // Личный кабинет — любой авторизованный
  if (pathname.startsWith("/profile")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  // Страница входа — если уже авторизован, перенаправляем
  if (pathname.startsWith("/auth/signin")) {
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/manager/:path*",
    "/profile/:path*",
    "/auth/signin",
  ],
};