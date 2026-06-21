// app/api/auth/update-role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const { email, userId, role } = await req.json();

    if (!role) {
      return NextResponse.json(
        { error: "Роль обязательна" },
        { status: 400 }
      );
    }

    // Ищем пользователя по email или id
    const where = email ? { email } : { id: userId };
    
    if (!where.email && !where.id) {
      return NextResponse.json(
        { error: "Email или ID пользователя обязательны" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where,
      data: { role },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Ошибка:", error);
    return NextResponse.json(
      { error: "Ошибка обновления роли" },
      { status: 500 }
    );
  }
}