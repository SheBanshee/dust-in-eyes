export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CalendarCheck, MessageSquare, Car } from "lucide-react";

export default async function ManagerDashboard() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  
  if (role !== "MANAGER" && role !== "ADMIN") {
    redirect("/");
  }

  const [pendingBookings, consultationsCount, carsCount] = await Promise.all([
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.consultation.count(),
    prisma.car.count(),
  ]);

  const stats = [
    { label: "Новых бронирований", value: pendingBookings, icon: CalendarCheck },
    { label: "Заявок на консультацию", value: consultationsCount, icon: MessageSquare },
    { label: "Автомобилей в парке", value: carsCount, icon: Car },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
          <p className="text-3xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}