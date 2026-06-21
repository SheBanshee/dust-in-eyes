// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Нет доступа" },
        { status: 403 }
      );
    }

    // Правильно получаем params с поддержкой Promise
    const params = await context.params;
    const id = params.id;
    
    console.log("🗑️ Удаление пользователя:", id);

    if (!id) {
      return NextResponse.json(
        { error: "ID пользователя не указан" },
        { status: 400 }
      );
    }

    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Нельзя удалить самого себя" },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    console.log(`✅ Пользователь ${id} удалён`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Ошибка при удалении:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ошибка при удалении" },
      { status: 500 }
    );
  }
}