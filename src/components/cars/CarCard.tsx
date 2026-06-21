// components/cars/CarCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface Props {
  car: any;
  index?: number;
}

const getCarImage = (brand: string, model: string): string => {
  const images: Record<string, string> = {
    "BMW-520d": "/cars/BMW520d.png",
    "BMW-X5 M50d": "/cars/BMWX5.png",        
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

export default function CarCard({ car }: Props) {
  const imageUrl = getCarImage(car.brand, car.model);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all">
      <div className="relative aspect-[16/10] bg-card">
        <Image
          src={imageUrl}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-contain p-4"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{car.brand} {car.model}</h3>
        <div className="text-sm text-muted-foreground mb-2">
          {car.year} · {car.horsepower} л.с. · {car.fuelType}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-accent font-bold">{formatPrice(car.pricePerDay)}/сут</span>
          <Link href={`/fleet/${car.id}`}>
            <Button size="sm">Подробнее</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}