export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Car, CalendarCheck, MessageSquare, Users } from "lucide-react";

export default async function AdminDashboard() {
  const [carsCount, bookingsCount, consultationsCount, usersCount] =
    await Promise.all([
      prisma.car.count(),
      prisma.booking.count(),
      prisma.consultation.count(),
      prisma.user.count(),
    ]);

  const pendingBookings = await prisma.booking.count({
    where: { status: "PENDING" },
  });

  const stats = [
    { label: "Автомобилей", value: carsCount, icon: Car },
    { label: "Бронирований", value: bookingsCount, icon: CalendarCheck, sub: `${pendingBookings} ожидают` },
    { label: "Консультаций", value: consultationsCount, icon: MessageSquare },
    { label: "Пользователей", value: usersCount, icon: Users },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Дашборд</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            {stat.sub && <p className="text-xs text-muted mt-1">{stat.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
