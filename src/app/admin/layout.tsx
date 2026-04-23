import Link from "next/link";
import { Car, CalendarCheck, MessageSquare, LayoutDashboard } from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/cars", label: "Автомобили", icon: Car },
  { href: "/admin/bookings", label: "Бронирования", icon: CalendarCheck },
  { href: "/admin/consultations", label: "Консультации", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0">
          <h2 className="text-lg font-bold mb-4 text-accent">Админ-панель</h2>
          <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card rounded-md transition-colors whitespace-nowrap"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
