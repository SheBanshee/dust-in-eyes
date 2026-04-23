"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z
  .object({
    startDate: z.string().min(1, "Выберите дату начала"),
    endDate: z.string().min(1, "Выберите дату окончания"),
    phone: z.string().min(11, "Введите корректный номер телефона"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "Дата окончания должна быть позже даты начала",
    path: ["endDate"],
  });

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carId: number;
  carName: string;
}

export default function BookingModal({ open, onOpenChange, carId, carName }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, carId }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Ошибка при бронировании");
        return;
      }
      setSubmitted(true);
      reset();
    } catch {
      alert("Произошла ошибка. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      setSubmitted(false);
      reset();
    }
    onOpenChange(v);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Забронируйте автомобиль {carName}</DialogTitle>
          <DialogDescription>
            Выберите период бронирования и укажите ваши контактные данные. Наш менеджер
            свяжется с вами в течение 30 минут, проконсультирует и поможет оформить
            бронирование.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="text-center py-6">
            <p className="text-accent font-semibold text-lg mb-2">Заявка отправлена!</p>
            <p className="text-muted-foreground text-sm">
              Наш менеджер свяжется с вами в ближайшее время для подтверждения бронирования.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">С</label>
                <Input type="date" min={minDate} {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-destructive text-xs mt-1">{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">До</label>
                <Input type="date" min={minDate} {...register("endDate")} />
                {errors.endDate && (
                  <p className="text-destructive text-xs mt-1">{errors.endDate.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Телефон</label>
              <Input placeholder="+7 (999) 123-45-67" {...register("phone")} />
              {errors.phone && (
                <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Отправка..." : "Забронировать"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
