"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Plus, Pencil, Trash2, AlertCircle, Loader2, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Car {
  id: number;
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
  videoUrl: string | null;
  images?: { id: number; url: string; isPrimary: boolean }[];
}

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

interface AdminCarsClientProps {
  cars: Car[];
}

export default function AdminCarsClient({ cars: initialCars }: AdminCarsClientProps) {
  const [cars, setCars] = useState(initialCars);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CarForm>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: number; url: string; isPrimary: boolean }[]>([]);
  
  // 👈 Ссылка на input для очистки
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchCars = async () => {
    setLoading(true);
    const res = await fetch("/api/cars?perPage=100");
    const data = await res.json();
    setCars(data.cars);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    
    // Очищаем старые превью
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews(previews);
  };

  // 👈 Удаление нового фото + ОЧИСТКА INPUT
  const handleRemoveNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });

    // 👈 ОЧИЩАЕМ ПОЛЕ ВВОДА, чтобы название файла исчезло
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
            body: JSON.stringify({
              url: imageUrl,
              isPrimary: i === 0 && existingImages.length === 0,
              displayOrder: i,
            }),
          });
        }
      }
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditId(null);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fetchCars();
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("Удалить это фото?")) return;

    try {
      const response = await fetch(`/api/cars/images/${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Ошибка при удалении фото");
      }

      setExistingImages(existingImages.filter((img) => img.id !== imageId));
      fetchCars();
    } catch (error) {
      alert("Не удалось удалить фото");
    }
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
    setExistingImages(car.images || []);
    setImageFiles([]);
    setImagePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setDialogOpen(true);
  };

  const handleDeleteClick = (car: Car) => {
    setCarToDelete(car);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!carToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/admin/cars/${carToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ошибка при удалении");
      }

      setDeleteDialogOpen(false);
      setCarToDelete(null);
      fetchCars();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsDeleting(false);
    }
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
            setExistingImages([]);
            setImageFiles([]);
            setImagePreviews([]);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
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
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(car)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Модалка добавления/редактирования */}
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

            {/* Существующие фото */}
            {existingImages.length > 0 && (
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Существующие фото</label>
                <div className="grid grid-cols-4 gap-3">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <Image
                        src={img.url}
                        alt="Фото"
                        width={100}
                        height={75}
                        className="rounded object-cover w-full h-20"
                      />
                      {img.isPrimary && (
                        <span className="absolute top-1 left-1 text-[8px] bg-accent text-white px-1 rounded">
                          MAIN
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Новые фото с превью */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                {editId ? "Добавить новые фото" : "Фотографии (обязательно)"}
              </label>
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={preview}
                        alt={`Новое фото ${index + 1}`}
                        width={100}
                        height={75}
                        className="rounded object-cover w-full h-20 border-2 border-accent/30"
                      />
                      <span className="absolute top-1 left-1 text-[8px] bg-accent/80 text-white px-1 rounded">
                        NEW
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {imageFiles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Выбрано файлов: {imageFiles.length}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              {editId ? "Сохранить" : "Добавить"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Модалка подтверждения удаления автомобиля */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Удаление автомобиля
            </DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить автомобиль{" "}
              <strong>
                {carToDelete?.brand} {carToDelete?.model}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertDescription>
                <p className="font-medium">Это действие необратимо!</p>
                <p className="text-sm mt-1">
                  Автомобиль будет удалён из базы данных вместе со всеми связанными бронированиями.
                </p>
              </AlertDescription>
            </Alert>

            {carToDelete && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Марка</span>
                  <span>{carToDelete.brand}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Модель</span>
                  <span>{carToDelete.model}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Год</span>
                  <span>{carToDelete.year}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Цена за сутки</span>
                  <span>{formatPrice(carToDelete.pricePerDay)}</span>
                </div>
              </div>
            )}

            {deleteError && (
              <Alert variant="destructive">
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Удаление...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить навсегда
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}