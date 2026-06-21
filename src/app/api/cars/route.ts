// app/api/cars/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(cars || []);
  } catch (error) {
    console.error("Ошибка:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const data = await req.json();
    const car = await prisma.car.create({
      data: {
        brand: data.brand,
        model: data.model,
        year: data.year,
        seats: data.seats,
        fuelType: data.fuelType,
        horsepower: data.horsepower,
        drivetrain: data.drivetrain,
        engineVolume: data.engineVolume,
        pricePerDay: data.pricePerDay,
        deposit: data.deposit || 10000,
        description: data.description,
        bodyType: data.bodyType || "sedan",
        doors: data.doors || 4,
        color: data.color || "Белый",
        screenshot: data.screenshot || null,
        available: data.available !== undefined ? data.available : true,
      },
    });
    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error("Ошибка:", error);
    return NextResponse.json(
      { error: "Ошибка при создании автомобиля" },
      { status: 500 }
    );
  }
}