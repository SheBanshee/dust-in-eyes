// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    // Проверяем авторизацию
    if (!session?.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    // Проверяем роль (только ADMIN)
    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Нет доступа" },
        { status: 403 }
      );
    }

    // ПОЛУЧАЕМ ID ПРАВИЛЬНО
    let id = context.params?.id;
    
    // Если params.id undefined — пробуем из URL
    if (!id) {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      id = pathParts[pathParts.length - 1];
      console.log('ID из URL:', id);
    }
    
    console.log("Удаление пользователя:", id);

    if (!id) {
      return NextResponse.json(
        { error: "ID пользователя не указан" },
        { status: 400 }
      );
    }

    // Нельзя удалить самого себя
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Нельзя удалить самого себя" },
        { status: 400 }
      );
    }

    // Проверяем, существует ли пользователь
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // Удаляем пользователя
    await prisma.user.delete({
      where: { id },
    });

    console.log(`Пользователь ${id} удалён`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Ошибка при удалении:", error);
    
    let errorMessage = "Ошибка при удалении пользователя";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}