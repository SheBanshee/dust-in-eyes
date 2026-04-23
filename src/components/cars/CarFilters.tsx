"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BRANDS = [
  "Все", "BMW", "Mercedes-Benz", "Porsche", "Rolls-Royce", "Ferrari",
  "Maserati", "Audi", "Range Rover", "Lamborghini",
];

const FUEL_TYPES = ["Все", "Бензин", "Дизель"];
const DRIVETRAINS = ["Все", "Задний", "Полный", "Передний"];

export default function CarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "Все");
  const [fuel, setFuel] = useState(searchParams.get("fuel") || "Все");
  const [drivetrain, setDrivetrain] = useState(searchParams.get("drivetrain") || "Все");
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (brand !== "Все") params.set("brand", brand);
    if (fuel !== "Все") params.set("fuel", fuel);
    if (drivetrain !== "Все") params.set("drivetrain", drivetrain);
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);
    router.push(`/fleet?${params.toString()}`);
  }, [search, brand, fuel, drivetrain, priceMin, priceMax, router]);

  const resetFilters = () => {
    setSearch("");
    setBrand("Все");
    setFuel("Все");
    setDrivetrain("Все");
    setPriceMin("");
    setPriceMax("");
    router.push("/fleet");
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            placeholder="Поиск по марке или модели..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="pl-10"
          />
        </div>
        <Button onClick={applyFilters}>Найти</Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Марка</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-10 rounded-md border border-border bg-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Топливо</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="w-full h-10 rounded-md border border-border bg-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Привод</label>
              <select
                value={drivetrain}
                onChange={(e) => setDrivetrain(e.target.value)}
                className="w-full h-10 rounded-md border border-border bg-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {DRIVETRAINS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Цена (₽/сутки)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="от"
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
                <Input
                  placeholder="до"
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={applyFilters} size="sm">
              Применить фильтры
            </Button>
            <Button onClick={resetFilters} variant="ghost" size="sm">
              <X className="w-4 h-4 mr-1" />
              Сбросить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
