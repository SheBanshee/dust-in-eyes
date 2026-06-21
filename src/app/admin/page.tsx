// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Consultation {
  id: number;
  name: string;
  phone: string;
  status: string;
  createdAt: string;
}

interface Booking {
  id: number;
  status: string;
}

interface Car {
  id: number;
  available: boolean;
}

interface User {
  id: string;
  role: string;
}

export default function AdminDashboardPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [consultationsRes, bookingsRes, carsRes, usersRes] = await Promise.all([
          fetch("/api/consultations"),
          fetch("/api/bookings"),
          fetch("/api/cars"),
          fetch("/api/users"),
        ]);

        const consultationsData = await consultationsRes.json();
        const bookingsData = await bookingsRes.json();
        const carsData = await carsRes.json();
        const usersData = await usersRes.json();

        setConsultations(Array.isArray(consultationsData) ? consultationsData : []);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setCars(Array.isArray(carsData) ? carsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Загрузка...</p>
      </div>
    );
  }

  const stats = {
    cars: cars.length,
    availableCars: cars.filter(c => c.available).length,
    users: users.length,
    consultations: consultations.length,
    completedConsultations: consultations.filter(c => c.status === "COMPLETED").length,
    newBookings: bookings.filter(b => b.status === "PENDING").length,
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Дашборд</h1>
      <p className="text-sm text-gray-400 mb-6">Общая статистика</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Авто в парке */}
        <div className="rounded-xl p-6" style={{ border: '1px solid rgba(156, 163, 175, 0.25)' }}>
          <div className="text-3xl font-semibold text-gray-800">{stats.cars}</div>
          <div className="text-sm text-gray-600 mt-1">Авто в парке</div>
          <div className="text-xs text-gray-400 mt-2">{stats.availableCars} доступно для аренды</div>
        </div>

        {/* Пользователи */}
        <div className="rounded-xl p-6" style={{ border: '1px solid rgba(156, 163, 175, 0.25)' }}>
          <div className="text-3xl font-semibold text-gray-800">{stats.users}+</div>
          <div className="text-sm text-gray-600 mt-1">Зарегистрированных пользователей</div>
          <div className="text-xs text-gray-400 mt-2">на сайте</div>
        </div>

        {/* На рынке */}
        <div className="rounded-xl p-6" style={{ border: '1px solid rgba(156, 163, 175, 0.25)' }}>
          <div className="text-3xl font-semibold text-gray-800">&lt;1</div>
          <div className="text-sm text-gray-600 mt-1">На рынке</div>
          <div className="text-xs text-gray-400 mt-2">менее года</div>
        </div>

        {/* Консультации */}
        <div className="rounded-xl p-6" style={{ border: '1px solid rgba(156, 163, 175, 0.25)' }}>
          <div className="text-3xl font-semibold text-gray-800">{stats.completedConsultations}</div>
          <div className="text-sm text-gray-600 mt-1">Консультаций</div>
          <div className="text-xs text-gray-400 mt-2">проведено</div>
        </div>
      </div>
    </div>
  );
}