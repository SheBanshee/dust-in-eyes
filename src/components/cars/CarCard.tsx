"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Car } from "@/types";

interface Props {
  car: Car;
  index?: number;
}

export default function CarCard({ car, index = 0 }: Props) {
  const primaryImage = car.images?.find((img) => img.isPrimary) || car.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={primaryImage?.url || "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80"}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-bold text-lg">
            {car.brand} {car.model}
          </p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-muted-foreground space-x-2">
            <span>{car.year}</span>
            <span>·</span>
            <span>{car.horsepower} л.с.</span>
            <span>·</span>
            <span>{car.fuelType}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-accent font-bold text-xl">{formatPrice(car.pricePerDay)}</span>
            <span className="text-muted text-sm"> / сутки</span>
          </div>
          <Link href={`/fleet/${car.id}`}>
            <Button size="sm">Подробнее</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
