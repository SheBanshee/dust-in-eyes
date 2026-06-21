import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { car: true },
    orderBy: { createdAt: "desc" },
  });

  const serializedUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
  };

  const serializedBookings = bookings.map((booking) => ({
    id: booking.id,
    carId: booking.carId,
    startDate: booking.startDate.toISOString(),
    endDate: booking.endDate.toISOString(),
    fullName: booking.fullName,
    phone: booking.phone,
    status: booking.status,
    car: {
      brand: booking.car.brand,
      model: booking.car.model,
      year: booking.car.year,
      pricePerDay: booking.car.pricePerDay,
    },
    createdAt: booking.createdAt.toISOString(),
  }));

  return <ProfileClient user={serializedUser} bookings={serializedBookings} />;
}