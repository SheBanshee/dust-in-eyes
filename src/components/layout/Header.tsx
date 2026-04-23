"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/fleet", label: "Автопарк" },
  { href: "/conditions", label: "Условия аренды" },
  { href: "/about", label: "О компании" },
  { href: "/contacts", label: "Контакты" },
];

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm lg:text-base">
              П
            </div>
            <span className="text-lg lg:text-xl font-bold tracking-tight group-hover:text-accent transition-colors">
              Пыль в глаза
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  {session.user?.name || session.user?.email}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-xl py-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-card-hover transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Личный кабинет
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-card-hover transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Админ-панель
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-card-hover transition-colors w-full text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  Войти
                </Button>
              </Link>
            )}
          </div>

          <button
            className="lg:hidden p-2 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 border-t border-border bg-background",
          mobileOpen ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <div className="px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link
                href="/profile"
                className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                onClick={() => setMobileOpen(false)}
              >
                Личный кабинет
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Админ-панель
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2 cursor-pointer"
              >
                Выйти
              </button>
            </>
          ) : (
            <Link href="/auth/signin" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                Войти
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
