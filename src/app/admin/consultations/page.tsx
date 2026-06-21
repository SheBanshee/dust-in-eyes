// app/admin/consultations/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Consultation {
  id: number;
  name: string;
  phone: string;
  status: string;
  createdAt: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  NEW: { label: "Новая", color: "text-yellow-600" },
  IN_PROGRESS: { label: "В обработке", color: "text-blue-600" },
  COMPLETED: { label: "Проведена", color: "text-green-600" },
  NO_ANSWER: { label: "Не дозвонились", color: "text-red-600" },
  CANCELLED: { label: "Отменена", color: "text-gray-400" },
};

const statusOptions = [
  { value: "ALL", label: "Все" },
  { value: "NEW", label: "Новые" },
  { value: "IN_PROGRESS", label: "В обработке" },
  { value: "COMPLETED", label: "Проведены" },
  { value: "NO_ANSWER", label: "Не дозвонились" },
  { value: "CANCELLED", label: "Отменены" },
];

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filtered, setFiltered] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const fetchConsultations = async () => {
    try {
      const res = await fetch("/api/consultations");
      const data = await res.json();
      setConsultations(data);
      setFiltered(data);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  useEffect(() => {
    if (filterStatus === "ALL") {
      setFiltered(consultations);
    } else {
      setFiltered(consultations.filter(c => c.status === filterStatus));
    }
  }, [consultations, filterStatus]);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Ошибка обновления");

      setConsultations(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("❌ Ошибка:", error);
      alert("Не удалось обновить статус");
    }
  };

  const deleteConsultation = async (id: number, name: string) => {
    if (!confirm(`Удалить заявку #${id} от "${name}"?`)) return;

    try {
      setDeletingId(id);
      const response = await fetch(`/api/consultations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Ошибка удаления");

      setConsultations(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("❌ Ошибка:", error);
      alert("Не удалось удалить заявку");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <p className="text-gray-400">Загрузка...</p>
    </div>
  );

  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Консультации</h1>
          <p className="text-sm text-gray-400 mt-0.5">Управление заявками</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            Всего: <span className="font-medium text-gray-600">{consultations.length}</span>
          </span>
          <button
            onClick={fetchConsultations}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-xs text-gray-400 mr-1">Фильтр:</span>
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilterStatus(opt.value)}
            className={`
              text-xs px-3 py-1 rounded-full transition-all duration-200
              ${filterStatus === opt.value
                ? "bg-gray-800 text-white"
                : "text-gray-500 hover:bg-gray-100"
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Таблица */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 rounded-xl" style={{ border: '1px solid rgba(156, 163, 175, 0.25)' }}>
          <p className="text-gray-400 text-sm">Нет заявок</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(156, 163, 175, 0.25)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50" style={{ borderBottom: '1px solid rgba(156, 163, 175, 0.15)' }}>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Имя</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Телефон</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Статус</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Дата</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors" style={{ borderBottom: '1px solid rgba(156, 163, 175, 0.08)' }}>
                    <td className="px-4 py-3 text-gray-400 text-xs">{item.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-700">{item.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{item.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${statusLabels[item.status]?.color || "text-gray-400"}`}>
                        {statusLabels[item.status]?.label || item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <select
                          value={item.status || "NEW"}
                          onChange={(e) => updateStatus(item.id, e.target.value)}
                          className="text-xs bg-transparent border-none text-gray-500 focus:outline-none cursor-pointer hover:text-gray-700"
                        >
                          {statusOptions.filter(s => s.value !== "ALL").map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => deleteConsultation(item.id, item.name)}
                          disabled={deletingId === item.id}
                          className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          {deletingId === item.id ? "" : "✕"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}