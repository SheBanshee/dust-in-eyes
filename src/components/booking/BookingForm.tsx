// src/components/booking/BookingForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BookingCalendar from "@/components/ui/BookingCalendar";

interface BookingFormProps {
  carId: number;
  bookedDates: Date[];
}

export default function BookingForm({ carId, bookedDates }: BookingFormProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDateSelect = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      setError("Выберите даты");
      return;
    }

    if (!fullName || !phone) {
      setError("Заполните все поля");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          fullName,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при бронировании");
      }

      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const daysCount = startDate && endDate 
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Календарь */}
      <div>
        <label className="text-sm font-medium block mb-2">
          Выберите даты аренды
        </label>
        <BookingCalendar
          bookedDates={bookedDates}
          onDateSelect={handleDateSelect}
          startDate={startDate}
          endDate={endDate}
        />
        
        {/* Отображение выбранных дат */}
        {startDate && endDate && (
          <div className="mt-2 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm">
              <span className="text-muted-foreground">С: </span>
              {format(startDate, "d MMMM yyyy", { locale: ru })}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">По: </span>
              {format(endDate, "d MMMM yyyy", { locale: ru })}
            </p>
            <p className="text-sm font-medium mt-1">
              <span className="text-muted-foreground">Дней: </span>
              {daysCount}
            </p>
          </div>
        )}
      </div>

      {/* Поля формы */}
      <div>
        <label className="text-sm font-medium block mb-1">ФИО</label>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Иванов Иван Иванович"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Телефон</label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (999) 123-45-67"
          required
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Бронируем..." : "Забронировать"}
      </Button>
    </form>
  );
}