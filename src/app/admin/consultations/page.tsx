"use client";

import { useEffect, useState } from "react";

interface ConsultationRow {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
}

export default function AdminConsultationsPage() {
  const [items, setItems] = useState<ConsultationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/consultations")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Заявки на консультацию</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Нет заявок</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-3">#</th>
                <th className="p-3">Имя</th>
                <th className="p-3">Телефон</th>
                <th className="p-3">Дата</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-card transition-colors">
                  <td className="p-3">{item.id}</td>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.phone}</td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString("ru-RU")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
