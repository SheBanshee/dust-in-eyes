// app/fleet/[id]/page.tsx
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Calendar, Users, Fuel, Gauge, Cog, Droplets, ArrowLeft, Paintbrush } from "lucide-react";
import CarDetailClient from "./CarDetailClient";
import CarGallery from "@/components/cars/CarGallery";

interface Props {
  params: Promise<{ id: string }>;
}

const getCarImage = (brand: string, model: string): string => {
  const images: Record<string, string> = {
    "BMW-520d": "/cars/BMW520d.png",
    "BMW-X5 M50d": "/cars/BMWXS.png",
    "Mercedes-Benz-S-Class W223": "/cars/MercedesSClass.png",
    "Mercedes-Benz-G63 AMG": "/cars/MercedesBenzG63.png",
    "Porsche-911 Carrera S": "/cars/Porsche911.png",
    "Porsche-Cayenne Turbo": "/cars/PorscheCayenne.png",
    "Maserati-Ghibli": "/cars/MaseratiGhibli.png",
    "Audi-RS6 Avant": "/cars/AudiRS6.png",
    "Ferrari-Roma": "/cars/FerrariRoma.png",
    "Lamborghini-Huracán EVO": "/cars/LamborghiniHuracan.png",
    "Range Rover-Autobiography": "/cars/RangeRover.png",
    "Rolls-Royce-Ghost": "/cars/RollsRoyceGhost.png",
  };
  
  const key = `${brand}-${model}`;
  return images[key] || "https://cdn-icons-png.flaticon.com/512/3096/3096980.png";
};

const getCarGallery = (brand: string, model: string) => {
  // ===== BMW =====
  if (brand === "BMW" && model === "520d") {
    return [
      { src: "/cars/BMW520d.png", alt: "Вид спереди (3/4)" },
      { src: "/cars/BMW520d_1.png", alt: "Вид сзади (3/4)" },
      { src: "/cars/BMW520d_2.png", alt: "Салон" },
      { src: "/cars/BMW520d_3.png", alt: "Детали" },
      { src: "/cars/BMW520d_4.png", alt: "Багажник" },
    ];
  }

  // ===== BMW X5 M50d — ИСПРАВЛЕНО =====
  if (brand === "BMW" && model === "X5 M50d") {
    return [
      { src: "/cars/BMWX5.png", alt: "Вид спереди (3/4)" },
      { src: "/cars/BMWX5_1.png", alt: "Вид сзади (3/4)" },
      { src: "/cars/BMWX5_2.png", alt: "Салон" },
      { src: "/cars/BMWX5_3.png", alt: "Детали" },
      { src: "/cars/BMWX5_4.png", alt: "Багажник" },
    ];
  }

  // ===== Mercedes-Benz =====
  if (brand === "Mercedes-Benz" && model === "S-Class W223") {
    return [
      { src: "/cars/MercedesSClass.png", alt: "Вид спереди (3/4)" },
      { src: "/cars/MercedesSClass_1.png", alt: "Вид сзади (3/4)" },
      { src: "/cars/MercedesSClass_2.png", alt: "Салон" },
      { src: "/cars/MercedesSClass_3.png", alt: "Детали" },
      { src: "/cars/MercedesSClass_4.png", alt: "Багажник" },
    ];
  }

  if (brand === "Mercedes-Benz" && model === "G63 AMG") {
    return [
      { src: "/cars/MercedesBenzG63.png", alt: "Вид спереди (3/4)" },
      { src: "/cars/MercedesBenzG63_1.png", alt: "Вид сзади (3/4)" },
      { src: "/cars/MercedesBenzG63_2.png", alt: "Салон" },
      { src: "/cars/MercedesBenzG63_3.png", alt: "Детали" },
      { src: "/cars/MercedesBenzG63_4.png", alt: "Багажник" },
    ];
  }

  // ===== Porsche =====
  if (brand === "Porsche" && model === "911 Carrera S") {
    return [
      { src: "/cars/Porsche911.png", alt: "Вид спереди (3/4)" },
      { src: "/cars/Porsche911_1.png", alt: "Вид сзади (3/4)" },
      { src: "/cars/Porsche911_2.png", alt: "Салон" },
      { src: "/cars/Porsche911_3.png", alt: "Детали" },
      { src: "/cars/Porsche911_4.png", alt: "Багажник" },
    ];
  }

  // ===== Porsche Cayenne Turbo — ИСПРАВЛЕНО =====
if (brand === "Porsche" && model === "Cayenne Turbo") {
  return [
    { src: "/cars/PorscheCayenne.png", alt: "Вид спереди (3/4)" },
    { src: "/cars/PorscheCayenne_1.png", alt: "Вид сзади (3/4)" },
    { src: "/cars/PorscheCayenne_2.png", alt: "Салон" },
    { src: "/cars/PorscheCayenne_3.png", alt: "Детали" },
    { src: "/cars/PorscheCayenne_4.png", alt: "Багажник" },
  ];
}

  // ===== Maserati =====
  if (brand === "Maserati" && model === "Ghibli") {
    return [
      { src: "/cars/MaseratiGhibli.png", alt: "Вид спереди (3/4)" },
      { src: "/cars/MaseratiGhibli_1.png", alt: "Вид сзади (3/4)" },
      { src: "/cars/MaseratiGhibli_2.png", alt: "Салон" },
      { src: "/cars/MaseratiGhibli_3.png", alt: "Детали" },
      { src: "/cars/MaseratiGhibli_4.png", alt: "Багажник" },
    ];
  }

  // ===== Audi =====
  if (brand === "Audi" && model === "RS6 Avant") {
    return [
      { src: "/cars/AudiRS6.png", alt: "Вид спереди (3/4)" },
      { src: "/cars/AudiRS6_1.png", alt: "Вид сзади (3/4)" },
      { src: "/cars/AudiRS6_2.png", alt: "Салон" },
      { src: "/cars/AudiRS6_3.png", alt: "Детали" },
      { src: "/cars/AudiRS6_4.png", alt: "Багажник" },
    ];
  }

  // ===== Ferrari =====
  if (brand === "Ferrari" && model === "Roma") {
    return [
      { src: "/cars/FerrariRoma.png", alt: "Вид спереди (3/4)" },
      { src: "/cars/FerrariRoma_1.png", alt: "Вид сзади (3/4)" },
      { src: "/cars/FerrariRoma_2.png", alt: "Салон" },
      { src: "/cars/FerrariRoma_3.png", alt: "Детали" },
      { src: "/cars/FerrariRoma_4.png", alt: "Багажник" },
    ];
  }

  // ===== Lamborghini =====
  if (brand === "Lamborghini" && model === "Huracán EVO") {
    return [
      { src: "/cars/LamborghiniHuracan.png", alt: "Вид спереди (3/4)" },
      { src: "/cars/LamborghiniHuracan_1.png", alt: "Вид сзади (3/4)" },
      { src: "/cars/LamborghiniHuracan_2.png", alt: "Салон" },
      { src: "/cars/LamborghiniHuracan_3.png", alt: "Детали" },
      { src: "/cars/LamborghiniHuracan_4.png", alt: "Багажник" },
    ];
  }

  // ===== Range Rover =====
  if (brand === "Range Rover" && model === "Autobiography") {
    return [
      { src: "/cars/RangeRover.png", alt: "Вид спереди (3/4)" },
      { src: "/cars/RangeRoverAutobiography_1.png", alt: "Вид сзади (3/4)" },
      { src: "/cars/RangeRoverAutobiography_2.png", alt: "Салон" },
      { src: "/cars/RangeRoverAutobiography_3.png", alt: "Детали" },
      { src: "/cars/RangeRoverAutobiography_4.png", alt: "Багажник" },
    ];
  }

  // ===== Rolls-Royce =====
  if (brand === "Rolls-Royce" && model === "Ghost") {
    return [
      { src: "/cars/RollsRoyceGhost.png", alt: "Вид спереди (3/4)" },
      { src: "/cars/RollsRoyceGhost_1.png", alt: "Вид сзади (3/4)" },
      { src: "/cars/RollsRoyceGhost_2.png", alt: "Салон" },
      { src: "/cars/RollsRoyceGhost_3.png", alt: "Детали" },
      { src: "/cars/RollsRoyceGhost_4.png", alt: "Багажник" },
    ];
  }

  // По умолчанию
  return [{ src: getCarImage(brand, model), alt: `${brand} ${model}` }];
};

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  const car = await prisma.car.findUnique({
    where: { id: parseInt(id) },
  });

  if (!car) return notFound();

  const galleryImages = getCarGallery(car.brand, car.model);

  const specs = [
    { icon: Calendar, label: "Год выпуска", value: car.year.toString() },
    { icon: Users, label: "Мест", value: car.seats.toString() },
    { icon: Fuel, label: "Топливо", value: car.fuelType },
    { icon: Gauge, label: "Мощность", value: `${car.horsepower} л.с.` },
    { icon: Cog, label: "Привод", value: car.drivetrain },
    { icon: Droplets, label: "Объём двигателя", value: `${car.engineVolume} л` },
    { icon: Paintbrush, label: "Цвет", value: car.color || "Не указан" },
  ];

  let bodyTypeText = "";
  switch (car.bodyType) {
    case "sedan": bodyTypeText = "Седан"; break;
    case "suv": bodyTypeText = "Внедорожник"; break;
    case "coupe": bodyTypeText = "Купе"; break;
    case "wagon": bodyTypeText = "Универсал"; break;
    default: bodyTypeText = car.bodyType;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Link href="/fleet" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Назад к автопарку
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Левая колонка — галерея */}
        <div className="lg:sticky lg:top-24 self-start">
          <CarGallery images={galleryImages} carName={`${car.brand} ${car.model}`} />
        </div>

        {/* Правая колонка — описание */}
        <div className="space-y-6">
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
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="text-xs text-muted">Тип кузова</p>
                  <p className="font-medium">{bodyTypeText}</p>
                </div>
              </div>
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

          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Залог</p>
                <p className="text-xl font-bold">{formatPrice(car.deposit || 10000)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Возвращается при возврате авто</p>
              </div>
            </div>
          </div>

          <div className="bg-accent/5 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2 text-accent">Важно знать</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Минимальный срок аренды — 1 сутки</li>
              <li>Возможна аренда с водителем</li>
              <li>Доставка по Москве — 3 000 руб</li>
              <li>Паспорт и права обязательны</li>
            </ul>
          </div>

          <CarDetailClient 
            carId={car.id} 
            carName={`${car.brand} ${car.model}`}
            carSeats={car.seats}
            carDoors={car.doors}
            carBodyType={car.bodyType}
          />
        </div>
      </div>
    </div>
  );
}