"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface BookingRow {
  id: number;
  startDate: string;
  endDate: string;
  phone: string;
  status: string;
  createdAt: string;
  car: { brand: string; model: string; pricePerDay: number };
  user?: { name: string | null; email: string };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchBookings();
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Ожидает", color: "text-yellow-500" },
    CONFIRMED: { label: "Подтверждено", color: "text-green-500" },
    CANCELLED: { label: "Отменено", color: "text-red-500" },
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Бронирования</h1>
      {bookings.length === 0 ? (
        <p className="text-muted-foreground">Нет бронирований</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-3">#</th>
                <th className="p-3">Автомобиль</th>
                <th className="p-3">Клиент</th>
                <th className="p-3">Телефон</th>
                <th className="p-3">Даты</th>
                <th className="p-3">Статус</th>
                <th className="p-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border hover:bg-card transition-colors">
                  <td className="p-3">{b.id}</td>
                  <td className="p-3 font-medium">
                    {b.car.brand} {b.car.model}
                    <br />
                    <span className="text-xs text-accent">{formatPrice(b.car.pricePerDay)}/сут</span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {b.user?.name || b.user?.email || "Гость"}
                  </td>
                  <td className="p-3">{b.phone}</td>
                  <td className="p-3 text-xs">
                    {new Date(b.startDate).toLocaleDateString("ru-RU")}
                    <br />
                    {new Date(b.endDate).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="p-3">
                    <span className={`font-medium ${statusLabels[b.status]?.color}`}>
                      {statusLabels[b.status]?.label}
                    </span>
                  </td>
                  <td className="p-3">
                    {b.status === "PENDING" && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateStatus(b.id, "CONFIRMED")}
                          title="Подтвердить"
                        >
                          <Check className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateStatus(b.id, "CANCELLED")}
                          title="Отменить"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
