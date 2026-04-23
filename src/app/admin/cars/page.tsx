"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Car } from "@/types";

interface CarForm {
  brand: string;
  model: string;
  year: number;
  seats: number;
  fuelType: string;
  horsepower: number;
  drivetrain: string;
  engineVolume: number;
  pricePerDay: number;
  description: string;
  videoUrl: string;
}

const emptyForm: CarForm = {
  brand: "",
  model: "",
  year: 2024,
  seats: 5,
  fuelType: "Бензин",
  horsepower: 0,
  drivetrain: "Полный",
  engineVolume: 0,
  pricePerDay: 0,
  description: "",
  videoUrl: "",
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CarForm>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const fetchCars = async () => {
    const res = await fetch("/api/cars?perPage=100");
    const data = await res.json();
    setCars(data.cars);
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editId ? `/api/cars/${editId}` : "/api/cars";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Ошибка при сохранении");
      return;
    }

    const car = await res.json();

    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const fd = new FormData();
        fd.append("file", imageFiles[i]);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (uploadRes.ok) {
          const { url: imageUrl } = await uploadRes.json();
          await fetch(`/api/cars/${car.id}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: imageUrl, isPrimary: i === 0, displayOrder: i }),
          });
        }
      }
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditId(null);
    setImageFiles([]);
    fetchCars();
  };

  const handleEdit = (car: Car) => {
    setForm({
      brand: car.brand,
      model: car.model,
      year: car.year,
      seats: car.seats,
      fuelType: car.fuelType,
      horsepower: car.horsepower,
      drivetrain: car.drivetrain,
      engineVolume: car.engineVolume,
      pricePerDay: car.pricePerDay,
      description: car.description,
      videoUrl: car.videoUrl || "",
    });
    setEditId(car.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить автомобиль?")) return;
    await fetch(`/api/cars/${id}`, { method: "DELETE" });
    fetchCars();
  };

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Автомобили</h1>
        <Button
          onClick={() => {
            setForm(emptyForm);
            setEditId(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3">Фото</th>
              <th className="p-3">Марка/Модель</th>
              <th className="p-3">Год</th>
              <th className="p-3">Цена/сутки</th>
              <th className="p-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => {
              const img = car.images?.find((i) => i.isPrimary) || car.images?.[0];
              return (
                <tr key={car.id} className="border-b border-border hover:bg-card transition-colors">
                  <td className="p-3">
                    {img && (
                      <Image
                        src={img.url}
                        alt={`${car.brand} ${car.model}`}
                        width={80}
                        height={50}
                        className="rounded object-cover"
                      />
                    )}
                  </td>
                  <td className="p-3 font-medium">
                    {car.brand} {car.model}
                  </td>
                  <td className="p-3">{car.year}</td>
                  <td className="p-3 text-accent">{formatPrice(car.pricePerDay)}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(car)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(car.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Редактировать" : "Добавить"} автомобиль</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Марка</label>
                <Input
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Модель</label>
                <Input
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Год</label>
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Мест</label>
                <Input
                  type="number"
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Тип топлива</label>
                <select
                  value={form.fuelType}
                  onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                  className="w-full h-10 rounded-md border border-border bg-input px-3 text-sm"
                >
                  <option>Бензин</option>
                  <option>Дизель</option>
                  <option>Электро</option>
                  <option>Гибрид</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Мощность (л.с.)</label>
                <Input
                  type="number"
                  value={form.horsepower}
                  onChange={(e) => setForm({ ...form, horsepower: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Привод</label>
                <select
                  value={form.drivetrain}
                  onChange={(e) => setForm({ ...form, drivetrain: e.target.value })}
                  className="w-full h-10 rounded-md border border-border bg-input px-3 text-sm"
                >
                  <option>Полный</option>
                  <option>Задний</option>
                  <option>Передний</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Объём (л)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.engineVolume}
                  onChange={(e) => setForm({ ...form, engineVolume: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Цена/сутки (₽)</label>
                <Input
                  type="number"
                  value={form.pricePerDay}
                  onChange={(e) => setForm({ ...form, pricePerDay: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Видео URL</label>
                <Input
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Описание</label>
              <textarea
                className="w-full min-h-[80px] rounded-md border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Фотографии {!editId && "(обязательно)"}
              </label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
              />
            </div>
            <Button type="submit" className="w-full">
              {editId ? "Сохранить" : "Добавить"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
