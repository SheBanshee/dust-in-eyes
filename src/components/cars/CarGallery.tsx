// components/cars/CarGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  src: string;
  alt: string;
}

interface Props {
  images: GalleryImage[];
  carName: string;
}

export default function CarGallery({ images, carName }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "Escape") setIsFullscreen(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/3] bg-card rounded-lg border border-border flex items-center justify-center">
        <p className="text-muted-foreground">Изображение недоступно</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative aspect-[4/3] bg-card rounded-lg border border-border overflow-hidden group">
          <Image
            src={images[currentIndex].src}
            alt={`${carName} — фото ${currentIndex + 1}`}
            fill
            className="object-contain p-4 cursor-pointer"
            priority
            onClick={() => setIsFullscreen(true)}
          />

          {images.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
            aria-label="Открыть на весь экран"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                aria-label="Следующее фото"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "relative aspect-square rounded-lg border-2 overflow-hidden transition-all",
                  currentIndex === index
                    ? "border-accent ring-2 ring-accent/30"
                    : "border-border opacity-60 hover:opacity-100 hover:border-accent/50"
                )}
              >
                <Image
                  src={img.src}
                  alt={`${carName} — фото ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== FULLSCREEN LIGHTBOX ===== */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
          onClick={() => setIsFullscreen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Счетчик */}
          {images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 text-white/80 text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Основное изображение */}
          <div className="relative flex-1 w-full flex items-center justify-center p-4 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[currentIndex].src}
              alt={`${carName} — фото ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Кнопки навигации */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-20"
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-20"
                aria-label="Следующее фото"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          {/* ===== КРЕСТИК ВНИЗУ РЯДОМ С МИНИАТЮРАМИ ===== */}
          <div className="w-full flex justify-center py-4 z-30 shrink-0 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex items-center gap-4 px-4 py-2 bg-black/60 rounded-lg backdrop-blur-sm">
              {/* Миниатюры */}
              <div className="flex gap-2 overflow-x-auto max-w-[60vw]">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    className={cn(
                      "relative w-14 h-14 flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all",
                      currentIndex === index
                        ? "border-white ring-2 ring-white/30"
                        : "border-white/30 opacity-50 hover:opacity-100"
                    )}
                  >
                    <Image src={img.src} alt={img.alt} fill className="object-cover" />
                  </button>
                ))}
              </div>

              {/* КРЕСТИК — СПРАВА ОТ МИНИАТЮР */}
              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center justify-center w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-lg flex-shrink-0"
                aria-label="Закрыть"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}