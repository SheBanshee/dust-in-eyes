import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// DELETE - отмена бронирования (для клиента) ИЛИ полное удаление (для админа)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    const bookingId = parseInt(id);
    
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // *** НОВЫЙ БЛОК: ПОЛНОЕ УДАЛЕНИЕ (только для админа) ***
    if (action === "force") {
      const role = (session?.user as { role?: string })?.role;
      
      if (!session?.user || role !== "ADMIN") {
        return NextResponse.json({ error: "Нет доступа. Только для администратора" }, { status: 403 });
      }
      
      await prisma.booking.delete({
        where: { id: bookingId },
      });
      return NextResponse.json({ success: true, message: "Бронирование удалено навсегда" }, { status: 200 });
    }

    // *** ОБЫЧНАЯ ОТМЕНА (меняет статус на CANCELLED) ***
    // Проверка авторизации
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }
    
    // Находим бронирование
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    
    if (!booking) {
      return NextResponse.json({ error: "Бронирование не найдено" }, { status: 404 });
    }
    
    // Проверяем, что бронирование принадлежит пользователю
    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }
    
    // Можно отменить только PENDING или CONFIRMED
    if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
      return NextResponse.json({ error: "Невозможно отменить бронирование" }, { status: 400 });
    }
    
    // Обновляем статус на CANCELLED
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
    
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// PATCH - для менеджера/админа (изменение статуса)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    
    if (!session?.user || (role !== "ADMIN" && role !== "MANAGER")) {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await req.json();

    const validStatuses = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Неверный статус" }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}