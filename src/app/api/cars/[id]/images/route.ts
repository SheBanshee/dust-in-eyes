// app/api/cars/[id]/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ===== POST — добавить изображение =====
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const { id } = await params;
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL изображения обязателен" },
        { status: 400 }
      );
    }

    const image = await prisma.image.create({
      data: {
        carId: parseInt(id),
        url,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Ошибка при добавлении изображения:", error);
    return NextResponse.json(
      { error: "Ошибка при добавлении изображения" },
      { status: 500 }
    );
  }
}

// ===== GET — получить все изображения для автомобиля =====
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID автомобиля не указан" },
        { status: 400 }
      );
    }

    const images = await prisma.image.findMany({
      where: { carId: parseInt(id) },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Ошибка при получении изображений:", error);
    return NextResponse.json(
      { error: "Ошибка при получении изображений" },
      { status: 500 }
    );
  }
}

// ===== DELETE — удалить изображение =====
export async function DELETE(
  req: NextRequest,
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
        { error: "ID изображения не указан" },
        { status: 400 }
      );
    }

    // Проверяем, существует ли изображение
    const existingImage = await prisma.image.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: "Изображение не найдено" },
        { status: 404 }
      );
    }

    await prisma.image.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении изображения:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении изображения" },
      { status: 500 }
    );
  }
}