import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as { role?: string })?.role;

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  if (pathname.startsWith("/profile")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
