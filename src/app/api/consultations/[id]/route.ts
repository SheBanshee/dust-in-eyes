// app/api/consultations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ===== GET — получить одну заявку =====
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID не указан" },
        { status: 400 }
      );
    }

    const consultation = await prisma.consultation.findUnique({
      where: { id: parseInt(id) },
    });

    if (!consultation) {
      return NextResponse.json(
        { error: "Заявка не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json(consultation);
  } catch (error) {
    console.error("Ошибка:", error);
    return NextResponse.json(
      { error: "Ошибка при получении заявки" },
      { status: 500 }
    );
  }
}

// ===== PATCH — обновить статус =====
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID не указан" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Статус не указан" },
        { status: 400 }
      );
    }

    const validStatuses = ["NEW", "IN_PROGRESS", "COMPLETED", "NO_ANSWER", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Некорректный статус. Доступные: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updatedConsultation = await prisma.consultation.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json(updatedConsultation);
  } catch (error) {
    console.error("Ошибка при обновлении:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении статуса" },
      { status: 500 }
    );
  }
}

// ===== DELETE — удалить заявку =====
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID не указан" },
        { status: 400 }
      );
    }

    const existing = await prisma.consultation.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Заявка не найдена" },
        { status: 404 }
      );
    }

    await prisma.consultation.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении заявки" },
      { status: 500 }
    );
  }
}