"use client";

import { useState } from "react";

interface Props {
  carId: number;
  carName: string;
}

export default function BookingButton({ carId, carName }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId,
          fullName: "Тестовый клиент",
          phone: "91234567890",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
          pickupAddress: "Салон: Москва, Большая Андроновская ул., 23",
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
        success
          ? "bg-green-500 text-white"
          : loading
          ? "bg-accent/50 text-accent-foreground cursor-not-allowed"
          : "bg-accent text-accent-foreground hover:bg-accent/80"
      }`}
    >
      {loading ? "⏳ Отправка..." : success ? "✅ Заявка отправлена!" : "Забронировать автомобиль"}
    </button>
  );
}