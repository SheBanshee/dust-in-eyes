"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

  const userRole = (session?.user as { role?: string })?.role;
  const isAdmin = userRole === "ADMIN";
  const isManager = userRole === "MANAGER";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Логотип слева */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 lg:w-12 lg:h-12 relative transition-all group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Пыль в глаза"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl lg:text-2xl font-bold tracking-tight group-hover:text-accent transition-colors">
              Пыль в глаза
            </span>
          </Link>

          {/* Навигация справа */}
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-6">
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

            {/* Кнопка входа / меню пользователя */}
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
                    <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-xl py-1 z-50">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-card-hover transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Личный кабинет
                      </Link>
                      {(isManager || isAdmin) && (
                        <Link
                          href="/manager"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-card-hover transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Панель менеджера
                        </Link>
                      )}
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
                        onClick={() => signOut({ callbackUrl: "/" })}
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

            {/* Кнопка мобильного меню */}
            <button
              className="lg:hidden p-2 cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню (выпадающее) */}
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
              {(isManager || isAdmin) && (
                <Link
                  href="/manager"
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Панель менеджера
                </Link>
              )}
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
                onClick={() => signOut({ callbackUrl: "/" })}
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