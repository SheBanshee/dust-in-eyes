import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const role = (session.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Нет прав доступа" }, { status: 403 });
    }

    const { id } = await params;
    const carId = parseInt(id);

    if (isNaN(carId)) {
      return NextResponse.json({ error: "Неверный ID автомобиля" }, { status: 400 });
    }

    const car = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return NextResponse.json({ error: "Автомобиль не найден" }, { status: 404 });
    }

    await prisma.car.delete({
      where: { id: carId },
    });

    return NextResponse.json({
      success: true,
      message: `Автомобиль ${car.brand} ${car.model} успешно удалён`,
    });
  } catch (error) {
    console.error("DELETE /api/admin/cars/[id] error:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении автомобиля" },
      { status: 500 }
    );
  }
}