import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;
  const { url, isPrimary, displayOrder } = await req.json();

  const image = await prisma.carImage.create({
    data: {
      carId: parseInt(id),
      url,
      isPrimary: isPrimary || false,
      displayOrder: displayOrder || 0,
    },
  });

  return NextResponse.json(image, { status: 201 });
}
