// src/app/api/cars/[id]/available/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "Укажите startDate и endDate" },
      { status: 400 }
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const carId = parseInt(params.id);

  // Проверяем пересечение с существующими бронированиями
  const existingBooking = await prisma.booking.findFirst({
    where: {
      carId,
      status: { notIn: ["CANCELLED", "COMPLETED"] },
      OR: [
        {
          AND: [
            { startDate: { lte: end } },
            { endDate: { gte: start } },
          ],
        },
      ],
    },
  });

  return NextResponse.json({
    available: !existingBooking,
    carId,
    startDate: start,
    endDate: end,
  });
}