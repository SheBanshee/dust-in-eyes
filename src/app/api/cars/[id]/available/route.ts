// app/api/cars/[id]/available/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    // Правильно получаем params с поддержкой Promise
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "ID автомобиля не указан" },
        { status: 400 }
      );
    }

    const carId = parseInt(id);
    if (isNaN(carId)) {
      return NextResponse.json(
        { error: "Некорректный ID автомобиля" },
        { status: 400 }
      );
    }

    // Проверяем бронирования, которые пересекаются с текущей датой
    const now = new Date();
    const activeBookings = await prisma.booking.findMany({
      where: {
        carId: carId,
        status: { in: ["CONFIRMED", "IN_PROGRESS"] },
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    const isAvailable = activeBookings.length === 0;

    return NextResponse.json({
      available: isAvailable,
      carId: carId,
      startDate: now,
      endDate: now,
    });
  } catch (error) {
    console.error("Ошибка проверки доступности:", error);
    return NextResponse.json(
      { error: "Ошибка при проверке доступности автомобиля" },
      { status: 500 }
    );
  }
}