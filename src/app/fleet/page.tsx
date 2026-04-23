export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import CarCard from "@/components/cars/CarCard";
import CarFilters from "@/components/cars/CarFilters";
import type { Prisma } from "@prisma/client";

interface Props {
  searchParams: Promise<{
    search?: string;
    brand?: string;
    fuel?: string;
    drivetrain?: string;
    priceMin?: string;
    priceMax?: string;
    page?: string;
  }>;
}

export default async function FleetPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const perPage = 9;

  const where: Prisma.CarWhereInput = { available: true };

  if (params.search) {
    where.OR = [
      { brand: { contains: params.search } },
      { model: { contains: params.search } },
    ];
  }
  if (params.brand) where.brand = params.brand;
  if (params.fuel) where.fuelType = params.fuel;
  if (params.drivetrain) where.drivetrain = params.drivetrain;
  if (params.priceMin || params.priceMax) {
    where.pricePerDay = {};
    if (params.priceMin) where.pricePerDay.gte = parseInt(params.priceMin);
    if (params.priceMax) where.pricePerDay.lte = parseInt(params.priceMax);
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

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">Автопарк</h1>
      <p className="text-muted-foreground mb-8">
        {total} {total === 1 ? "автомобиль" : total < 5 ? "автомобиля" : "автомобилей"} в наличии
      </p>

      <Suspense fallback={<div>Загрузка фильтров...</div>}>
        <CarFilters />
      </Suspense>

      {cars.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            Автомобили не найдены. Попробуйте изменить фильтры.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car, i) => (
            <CarCard key={car.id} car={JSON.parse(JSON.stringify(car))} index={i} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const params2 = new URLSearchParams();
            if (params.search) params2.set("search", params.search);
            if (params.brand) params2.set("brand", params.brand);
            if (params.fuel) params2.set("fuel", params.fuel);
            if (params.drivetrain) params2.set("drivetrain", params.drivetrain);
            if (params.priceMin) params2.set("priceMin", params.priceMin);
            if (params.priceMax) params2.set("priceMax", params.priceMax);
            params2.set("page", p.toString());

            return (
              <a
                key={p}
                href={`/fleet?${params2.toString()}`}
                className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border hover:bg-card-hover"
                }`}
              >
                {p}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
