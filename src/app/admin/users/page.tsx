// app/admin/users/page.tsx
"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

const roleLabels: Record<string, { label: string; color: string }> = {
  ADMIN: { label: "Админ", color: "text-purple-600" },
  MANAGER: { label: "Менеджер", color: "text-blue-600" },
  USER: { label: "Пользователь", color: "text-gray-600" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      
      if (!res.ok) {
        throw new Error(`Ошибка ${res.status}`);
      }
      
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      setError("Не удалось загрузить пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id: string, newRole: string) => {
    try {
      setUpdatingId(id);
      
      const res = await fetch("/api/auth/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, role: newRole }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Ошибка обновления");
      }

      // Обновляем локальный список
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? { ...user, role: newRole } : user
        )
      );
      
      console.log(`Роль пользователя обновлена на ${newRole}`);
    } catch (err) {
      console.error("Ошибка обновления:", err);
      alert(err instanceof Error ? err.message : "Не удалось обновить роль");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Удалить пользователя "${name}"?`)) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Ошибка удаления");
      }

      setUsers(prev => prev.filter(user => user.id !== id));
      console.log(`Пользователь удалён`);
    } catch (err) {
      console.error("Ошибка удаления:", err);
      alert(err instanceof Error ? err.message : "Не удалось удалить пользователя");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          <p className="font-medium">Ошибка</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Пользователи</h1>
          <p className="text-sm text-gray-400 mt-0.5">Управление пользователями</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            Всего: <span className="font-medium text-gray-600">{users.length}</span>
          </span>
          <button
            onClick={fetchUsers}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-10 rounded-xl" style={{ border: '1px solid rgba(156, 163, 175, 0.25)' }}>
          <p className="text-gray-400 text-sm">Нет пользователей</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(156, 163, 175, 0.25)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50" style={{ borderBottom: '1px solid rgba(156, 163, 175, 0.15)' }}>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Имя</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Роль</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Дата регистрации</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors" style={{ borderBottom: '1px solid rgba(156, 163, 175, 0.08)' }}>
                    <td className="px-4 py-3 text-gray-400 text-xs">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-700">{user.name || "—"}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${roleLabels[user.role]?.color || "text-gray-400"}`}>
                        {roleLabels[user.role]?.label || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value)}
                          disabled={updatingId === user.id}
                          className="text-xs bg-transparent border border-gray-200 rounded px-2 py-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-50"
                        >
                          <option value="USER">Пользователь</option>
                          <option value="MANAGER">Менеджер</option>
                          <option value="ADMIN">Админ</option>
                        </select>

                        <button
                          onClick={() => deleteUser(user.id, user.name || user.email)}
                          disabled={updatingId === user.id}
                          className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Удалить"
                        >
                          ✕
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