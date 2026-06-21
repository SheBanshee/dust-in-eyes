// app/fleet/page.tsx
import { prisma } from "@/lib/prisma";
import CarCard from "@/components/cars/CarCard";

export const dynamic = "force-dynamic";

export default async function FleetPage() {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold">Автопарк</h1>
        <p className="text-muted-foreground mt-1">
          Аренда автомобилей премиум-класса в Москве.
          Rolls-Royce, Ferrari, Porsche, BMW, Mercedes-Benz —
          лучшие автомобили для ваших особых моментов.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {cars.length} автомобилей в наличии
        </p>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Автомобили не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}