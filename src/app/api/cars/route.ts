import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const brand = searchParams.get("brand");
  const fuel = searchParams.get("fuel");
  const drivetrain = searchParams.get("drivetrain");
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "12");

  const where: Prisma.CarWhereInput = { available: true };

  if (search) {
    where.OR = [
      { brand: { contains: search } },
      { model: { contains: search } },
    ];
  }
  if (brand) where.brand = brand;
  if (fuel) where.fuelType = fuel;
  if (drivetrain) where.drivetrain = drivetrain;
  if (priceMin || priceMax) {
    where.pricePerDay = {};
    if (priceMin) where.pricePerDay.gte = parseInt(priceMin);
    if (priceMax) where.pricePerDay.lte = parseInt(priceMax);
  }

  const [cars, total] = await Promise.all([
    prisma.car.findMany({
      where,
      include: { images: true },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { pricePerDay: "asc" },
    }),
    prisma.car.count({ where }),
  ]);

  return NextResponse.json({ cars, total, page, perPage });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const data = await req.json();
  const car = await prisma.car.create({ data });
  return NextResponse.json(car, { status: 201 });
}
