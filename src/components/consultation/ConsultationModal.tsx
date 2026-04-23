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

const schema = z.object({
  name: z.string().min(2, "Введите ваше имя"),
  phone: z.string().min(11, "Введите корректный номер телефона"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConsultationModal({ open, onOpenChange }: Props) {
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
      await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Получите консультацию</DialogTitle>
          <DialogDescription>
            Заполните ваши данные ниже. Наш менеджер свяжется с вами в течение 30 минут,
            проконсультирует и поможет оформить бронирование.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="text-center py-6">
            <p className="text-accent font-semibold text-lg mb-2">Заявка отправлена!</p>
            <p className="text-muted-foreground text-sm">
              Наш менеджер свяжется с вами в ближайшее время.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Ваше имя</label>
              <Input placeholder="Иван" {...register("name")} />
              {errors.name && (
                <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Телефон</label>
              <Input placeholder="+7 (999) 123-45-67" {...register("phone")} />
              {errors.phone && (
                <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Отправка..." : "Получить консультацию"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
