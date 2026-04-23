import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const consultations = await prisma.consultation.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(consultations);
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone } = await req.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Имя и телефон обязательны" },
        { status: 400 }
      );
    }

    const consultation = await prisma.consultation.create({
      data: { name, phone },
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Ошибка при создании заявки" },
      { status: 500 }
    );
  }
}
