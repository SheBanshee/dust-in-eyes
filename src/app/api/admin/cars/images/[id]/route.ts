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
    const imageId = parseInt(id);

    if (isNaN(imageId)) {
      return NextResponse.json({ error: "Неверный ID фото" }, { status: 400 });
    }

    // Проверяем, существует ли фото
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: "Фото не найдено" }, { status: 404 });
    }

    // Удаляем фото
    await prisma.image.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ 
      success: true,
      message: "Фото успешно удалено"
    });
  } catch (error) {
    console.error("DELETE /api/cars/images/[id] error:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении фото" },
      { status: 500 }
    );
  }
}