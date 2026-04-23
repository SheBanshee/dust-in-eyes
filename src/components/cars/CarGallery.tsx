"use client";

import { useState } from "react";
import Image from "next/image";
import type { CarImage } from "@/types";

interface Props {
  images: CarImage[];
  videoUrl?: string | null;
  carName: string;
}

export default function CarGallery({ images, videoUrl, carName }: Props) {
  const sorted = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-card">
        <Image
          src={sorted[activeIndex]?.url || "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80"}
          alt={carName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {sorted.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActiveIndex(i)}
            className={`relative w-20 h-14 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
              i === activeIndex ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={img.url}
              alt={`${carName} ${i + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {videoUrl && (
        <div className="rounded-lg overflow-hidden aspect-video">
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={`${carName} видео`}
          />
        </div>
      )}
    </div>
  );
}
