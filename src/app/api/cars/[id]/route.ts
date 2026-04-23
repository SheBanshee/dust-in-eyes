import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const car = await prisma.car.findUnique({
    where: { id: parseInt(id) },
    include: { images: true },
  });

  if (!car) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  return NextResponse.json(car);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;
  const data = await req.json();
  const car = await prisma.car.update({
    where: { id: parseInt(id) },
    data,
  });

  return NextResponse.json(car);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.car.delete({ where: { id: parseInt(id) } });

  return NextResponse.json({ success: true });
}
