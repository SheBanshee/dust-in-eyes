export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminCarsClient from "./AdminCarsClient";

export default async function AdminCarsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const role = (session.user as { role?: string })?.role;
  
  if (role !== "ADMIN") {
    redirect("/");
  }

  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminCarsClient cars={cars} />;
}