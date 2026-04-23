"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "./CarCard";
import type { Car } from "@/types";

interface Props {
  cars: Car[];
}

export default function CarCarousel({ cars }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {cars.map((car, i) => (
            <div key={car.id} className="flex-none w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <CarCard car={car} index={i} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-30 cursor-pointer z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-30 cursor-pointer z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
