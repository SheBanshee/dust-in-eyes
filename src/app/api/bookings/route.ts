// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ===== GET — список бронирований (доступно ADMIN и MANAGER) =====
export async function GET() {
  try {
    const session = await auth();
    
    // Проверяем авторизацию
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // Проверяем роль (ADMIN или MANAGER)
    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "ADMIN" && userRole !== "MANAGER") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        car: {
          select: {
            brand: true,
            model: true,
            year: true,
            pricePerDay: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Ошибка при получении бронирований:", error);
    return NextResponse.json(
      { error: "Ошибка при загрузке бронирований" },
      { status: 500 }
    );
  }
}

// ===== POST — создание бронирования (доступно всем авторизованным) =====
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Необходимо авторизоваться" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("📦 Данные:", body);

    const {
      carId,
      startDate,
      endDate,
      fullName,
      phone,
      passportNumber,
      driverLicense,
      withDriver,
      pickupAddress,
      driverGender,
      driverAge,
      driverHours,
      childSeat,
      petTransport,
      driverComment,
    } = body;

    // Проверяем обязательные поля
    if (!carId) {
      return NextResponse.json(
        { error: "ID автомобиля обязателен" },
        { status: 400 }
      );
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Даты начала и окончания обязательны" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Телефон обязателен" },
        { status: 400 }
      );
    }

    // Проверяем автомобиль
    const car = await prisma.car.findUnique({
      where: { id: Number(carId) },
    });

    if (!car) {
      return NextResponse.json(
        { error: `Автомобиль с ID ${carId} не найден` },
        { status: 404 }
      );
    }

    // Создаём бронирование
    let userId = null;
    if (session?.user?.id) {
      const userExists = await prisma.user.findUnique({
        where: { id: session.user.id },
      });
      if (userExists) {
        userId = session.user.id;
      }
    }

    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        carId: Number(carId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        fullName: fullName || "Аноним",
        phone: phone,
        passportNumber: passportNumber || null,
        driverLicense: driverLicense || null,
        withDriver: withDriver || false,
        pickupAddress: pickupAddress || null,
        driverGender: driverGender || null,
        driverAge: driverAge || null,
        driverHours: driverHours || null,
        childSeat: childSeat || null,
        petTransport: petTransport || null,
        driverComment: driverComment || null,
        status: "PENDING",
      },
    });

    console.log(`Бронирование #${booking.id} создано`);
    return NextResponse.json(booking, { status: 201 });

  } catch (error) {
    console.error("Ошибка при создании:", error);
    return NextResponse.json(
      {
        error: "Ошибка при создании бронирования",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}