"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface Booking {
  id: number;
  fullName: string | null;
  phone: string;
  startDate: string;
  endDate: string;
  status: string;
  withDriver: boolean;
  pickupAddress: string | null;
  driverGender: string | null;
  driverAge: string | null;
  driverHours: string | null;
  childSeat: string | null;
  petTransport: string | null;
  driverComment: string | null;
  car: { brand: string; model: string; pricePerDay: number };
  user?: { name: string | null; email: string };
}

const statusLabels: Record<string, { label: string; color: string; nextStatus?: string }> = {
  PENDING: { label: "Новая заявка", color: "text-yellow-500", nextStatus: "CONFIRMED" },
  CONFIRMED: { label: "Подтверждено", color: "text-green-500", nextStatus: "IN_PROGRESS" },
  IN_PROGRESS: { label: "Машина выдана", color: "text-blue-500", nextStatus: "COMPLETED" },
  COMPLETED: { label: "Завершено", color: "text-gray-400" },
  CANCELLED: { label: "Отменено", color: "text-red-500" },
};

const genderLabels: Record<string, string> = {
  male: "Мужской",
  female: "Женский",
  any: "Любой",
};

const ageLabels: Record<string, string> = {
  young: "25-35 лет",
  middle: "35-50 лет",
  senior: "50+ лет",
};

const hoursLabels: Record<string, string> = {
  standard: "8 ч",
  full: "12 ч",
  extended: "без лимита",
};

const childSeatLabels: Record<string, string> = {
  none: "Нет",
  infant: "До 1 года (люлька)",
  toddler: "1-3 года",
  child: "4-7 лет",
  booster: "7-12 лет",
};

const petLabels: Record<string, string> = {
  none: "Нет",
  small: "Мелкая (до 5 кг)",
  medium: "Средняя (5-15 кг)",
  large: "Крупная (15-30 кг)",
};

export default function ManagerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      // Убеждаемся, что data - это массив
      setBookings(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Не удалось загрузить бронирования");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchBookings();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">Ошибка: {error}</p>;
  if (!bookings.length) return <p className="text-muted-foreground">Нет бронирований</p>;

  const statusOrder = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
  const sortedBookings = [...bookings].sort((a, b) => {
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Управление бронированиями</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[1000px]">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-2">Статус</th>
              <th className="p-2">Автомобиль</th>
              <th className="p-2">Клиент</th>
              <th className="p-2">Телефон</th>
              <th className="p-2">Даты</th>
              <th className="p-2">Водитель</th>
              <th className="p-2">Детали</th>
              <th className="p-2">Действия</th>
             </tr>
          </thead>
          <tbody>
            {sortedBookings.map((b) => (
              <tr key={b.id} className="border-b border-border hover:bg-card transition-colors">
                <td className="p-2">
                  <span className={`font-medium ${statusLabels[b.status]?.color}`}>
                    {statusLabels[b.status]?.label}
                  </span>
                 </td>
                <td className="p-2 font-medium">
                  {b.car.brand} {b.car.model}
                  <br />
                  <span className="text-xs text-accent">{formatPrice(b.car.pricePerDay)}/сут</span>
                 </td>
                <td className="p-2 text-muted-foreground">
                  {b.fullName || b.user?.name || b.user?.email || "Гость"}
                 </td>
                <td className="p-2">{b.phone}</td>
                <td className="p-2 text-xs">
                  {new Date(b.startDate).toLocaleDateString("ru-RU")}
                  <br />
                  {new Date(b.endDate).toLocaleDateString("ru-RU")}
                 </td>
                <td className="p-2">
                  {b.withDriver ? (
                    <span className="text-green-500 text-xs font-medium">
                      Да ({hoursLabels[b.driverHours || "standard"]})
                    </span>
                  ) : (
                    <span className="text-gray-400">Нет</span>
                  )}
                 </td>
                <td className="p-2 text-xs">
                  {b.childSeat && b.childSeat !== "none" && (
                    <div className="text-accent">Детское кресло: {childSeatLabels[b.childSeat]}</div>
                  )}
                  {b.petTransport && b.petTransport !== "none" && (
                    <div className="text-accent">Животное: {petLabels[b.petTransport]}</div>
                  )}
                  {b.withDriver && (
                    <div className="space-y-1 mt-1 pt-1 border-t border-border/50">
                      {b.driverGender && b.driverGender !== "any" && (
                        <div>Пол: {genderLabels[b.driverGender]}</div>
                      )}
                      {b.driverAge && (
                        <div>Возраст: {ageLabels[b.driverAge]}</div>
                      )}
                      {b.driverComment && (
                        <div className="text-muted-foreground">Пожелания: {b.driverComment}</div>
                      )}
                    </div>
                  )}
                  {b.pickupAddress && (
                    <div className="text-muted-foreground mt-1">Подача: {b.pickupAddress}</div>
                  )}
                 </td>
                <td className="p-2">
                  {statusLabels[b.status]?.nextStatus && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(b.id, statusLabels[b.status]!.nextStatus!)}
                    >
                      → {statusLabels[statusLabels[b.status]!.nextStatus!]?.label}
                    </Button>
                  )}
                  {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 ml-1"
                      onClick={() => updateStatus(b.id, "CANCELLED")}
                    >
                      Отмена
                    </Button>
                  )}
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}