export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { User, Calendar, Phone, Mail } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { car: { include: { images: true } } },
    orderBy: { createdAt: "desc" },
  });

  const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING: { label: "На рассмотрении", color: "text-yellow-500" },
    CONFIRMED: { label: "Подтверждено", color: "text-green-500" },
    CANCELLED: { label: "Отменено", color: "text-red-500" },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-8">Личный кабинет</h1>

      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-accent" />
          Профиль
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted" />
            <div>
              <p className="text-xs text-muted">Email</p>
              <p>{user?.email}</p>
            </div>
          </div>
          {user?.name && (
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted" />
              <div>
                <p className="text-xs text-muted">Имя</p>
                <p>{user.name}</p>
              </div>
            </div>
          )}
          {user?.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted" />
              <div>
                <p className="text-xs text-muted">Телефон</p>
                <p>{user.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          История бронирований
        </h2>
        {bookings.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">У вас пока нет бронирований</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1">
                  <p className="font-semibold text-lg">
                    {booking.car.brand} {booking.car.model}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.startDate).toLocaleDateString("ru-RU")} —{" "}
                    {new Date(booking.endDate).toLocaleDateString("ru-RU")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Тел: {booking.phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-accent font-semibold">
                    {formatPrice(booking.car.pricePerDay)}/сутки
                  </p>
                  <p className={`text-sm font-medium ${statusLabels[booking.status]?.color}`}>
                    {statusLabels[booking.status]?.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
