import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const isAdmin = (session.user as { role?: string }).role === "ADMIN";

  const bookings = await prisma.booking.findMany({
    where: isAdmin ? {} : { userId: session.user.id },
    include: {
      car: { include: { images: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const { carId, startDate, endDate, phone } = await req.json();

    if (!carId || !startDate || !endDate || !phone) {
      return NextResponse.json(
        { error: "Все поля обязательны" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        carId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        phone,
        userId: session?.user?.id || null,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Ошибка при создании бронирования" },
      { status: 500 }
    );
  }
}
