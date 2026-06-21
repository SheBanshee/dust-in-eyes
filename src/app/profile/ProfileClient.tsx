"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { User, Calendar, Phone, Mail, Car, X, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatPrice } from "@/lib/utils";

interface Booking {
  id: number;
  carId: number;
  startDate: string;
  endDate: string;
  fullName: string | null;
  phone: string;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  car: {
    brand: string;
    model: string;
    year: number;
    pricePerDay: number;
  };
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
}

interface ProfileClientProps {
  user: User;
  bookings: Booking[];
}

const statusLabels: Record<Booking["status"], { label: string; color: string; badge: string }> = {
  PENDING: {
    label: "На рассмотрении",
    color: "text-yellow-500",
    badge: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  CONFIRMED: {
    label: "Подтверждено",
    color: "text-green-500",
    badge: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  IN_PROGRESS: {
    label: "Машина выдана",
    color: "text-blue-500",
    badge: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  COMPLETED: {
    label: "Завершено",
    color: "text-gray-500",
    badge: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  },
  CANCELLED: {
    label: "Отменено",
    color: "text-red-500",
    badge: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export default function ProfileClient({ user, bookings }: ProfileClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setError(null);
    setIsModalOpen(true);
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ошибка при отмене бронирования");
      }

      setIsModalOpen(false);
      setSuccessMessage("Бронирование успешно отменено");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const canCancel = (status: Booking["status"]) => {
    return ["PENDING", "CONFIRMED"].includes(status);
  };

  const getTimeInfo = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const hoursUntilStart = Math.max(0, (start.getTime() - now.getTime()) / (1000 * 60 * 60));
    const isSoon = hoursUntilStart < 24;
    return { isSoon, hoursUntilStart };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-8">Личный кабинет</h1>

      {successMessage && (
        <Alert className="mb-6 border-green-500/50 bg-green-500/10 text-green-500">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-accent" />
          Профиль
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p>{user.email}</p>
            </div>
          </div>
          {user.name && (
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Имя</p>
                <p>{user.name}</p>
              </div>
            </div>
          )}
          {user.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Телефон</p>
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
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Car className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">У вас пока нет бронирований</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/fleet")}>
              Выбрать автомобиль
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const status = statusLabels[booking.status] || statusLabels.PENDING;
              const startDate = new Date(booking.startDate);
              const endDate = new Date(booking.endDate);
              const days = Math.max(
                1,
                Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
              );
              const totalPrice = booking.car.pricePerDay * days;

              return (
                <div
                  key={booking.id}
                  className="bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-accent/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-semibold text-lg">
                        {booking.car.brand} {booking.car.model}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${status.badge}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(startDate, "d MMMM yyyy", { locale: ru })} —{" "}
                      {format(endDate, "d MMMM yyyy", { locale: ru })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {days} {days === 1 ? "день" : days < 5 ? "дня" : "дней"} · {booking.car.year} г.
                    </p>
                    {booking.fullName && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Контакт: {booking.fullName}, {booking.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="text-accent font-semibold text-lg">
                      {formatPrice(totalPrice)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(booking.car.pricePerDay)}/сутки
                    </p>
                    {canCancel(booking.status) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelClick(booking)}
                        className="w-full sm:w-auto"
                      >
                        <X className="w-4 h-4 mr-1.5" />
                        Отменить
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Отмена бронирования
            </DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите отменить бронирование автомобиля{" "}
              <strong>
                {selectedBooking?.car.brand} {selectedBooking?.car.model}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Дата начала</span>
                  <span>
                    {format(new Date(selectedBooking.startDate), "d MMMM yyyy", {
                      locale: ru,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Дата окончания</span>
                  <span>
                    {format(new Date(selectedBooking.endDate), "d MMMM yyyy", {
                      locale: ru,
                    })}
                  </span>
                </div>
              </div>

              {(() => {
                const { isSoon, hoursUntilStart } = getTimeInfo(selectedBooking.startDate);
                return isSoon ? (
                  <Alert variant="destructive" className="border-orange-500/50 bg-orange-500/10 text-orange-500">
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-medium">До начала аренды менее 24 часов</p>
                      <p className="text-sm mt-1">
                        Отмена возможна, но автомобиль уже забронирован за вами
                      </p>
                      <p className="text-xs mt-2">
                        Осталось {Math.floor(hoursUntilStart)} часов{" "}
                        {Math.floor((hoursUntilStart % 1) * 60)} минут
                      </p>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-green-500/50 bg-green-500/10 text-green-500">
                    <AlertDescription>
                      <p className="font-medium">До начала аренды более 24 часов</p>
                      <p className="text-sm mt-1">
                        Вы можете отменить бронирование без штрафа
                      </p>
                    </AlertDescription>
                  </Alert>
                );
              })()}

              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                <p>ℹ️ Оплата производится при получении автомобиля</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isLoading}>
              Вернуться
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
              {isLoading ? "Отменяем..." : "Да, отменить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}