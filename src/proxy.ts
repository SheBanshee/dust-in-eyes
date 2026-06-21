// src/proxy.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as { role?: string })?.role;

  // Админ-панель — только ADMIN
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  // Менеджер-панель — MANAGER или ADMIN
  if (pathname.startsWith("/manager")) {
    if (!isLoggedIn || (role !== "MANAGER" && role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  // Профиль — любой авторизованный
  if (pathname.startsWith("/profile")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  // Страница входа — если уже авторизован, перенаправляем
  if (pathname.startsWith("/auth/signin")) {
    if (isLoggedIn) {
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