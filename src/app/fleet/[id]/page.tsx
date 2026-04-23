export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import CarGallery from "@/components/cars/CarGallery";
import CarDetailClient from "./CarDetailClient";
import { Calendar, Users, Fuel, Gauge, Cog, Droplets } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  const car = await prisma.car.findUnique({
    where: { id: parseInt(id) },
    include: { images: true },
  });

  if (!car) return notFound();

  const carData = JSON.parse(JSON.stringify(car));

  const specs = [
    { icon: Calendar, label: "Год выпуска", value: car.year.toString() },
    { icon: Users, label: "Мест", value: car.seats.toString() },
    { icon: Fuel, label: "Топливо", value: car.fuelType },
    { icon: Gauge, label: "Мощность", value: `${car.horsepower} л.с.` },
    { icon: Cog, label: "Привод", value: car.drivetrain },
    { icon: Droplets, label: "Объём двигателя", value: `${car.engineVolume} л` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-3">
          <CarGallery
            images={carData.images}
            videoUrl={car.videoUrl}
            carName={`${car.brand} ${car.model}`}
          />
        </div>

        <div className="lg:col-span-2">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            {car.brand} {car.model}
          </h1>
          <p className="text-muted-foreground mb-6">{car.description}</p>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-center gap-3">
                  <spec.icon className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <p className="text-xs text-muted">{spec.label}</p>
                    <p className="font-medium">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-accent/30 rounded-lg p-6 mb-6">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-accent">
                {formatPrice(car.pricePerDay)}
              </span>
              <span className="text-muted-foreground">/ сутки</span>
            </div>
          </div>

          <CarDetailClient carId={car.id} carName={`${car.brand} ${car.model}`} />
        </div>
      </div>
    </div>
  );
}
