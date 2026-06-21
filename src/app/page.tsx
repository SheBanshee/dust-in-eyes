// app/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import CarCard from "@/components/cars/CarCard";
import { 
  Car, 
  Clock, 
  MapPin,
} from "lucide-react";

export default async function HomePage() {
  const cars = await prisma.car.findMany({
    where: { available: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  const advantages = [
    {
      icon: Car,
      title: "Премиальный автопарк",
      desc: "Только лучшие марки — Rolls-Royce, Ferrari, Porsche, BMW, Mercedes-Benz и другие",
    },
    {
      icon: Clock,
      title: "Быстрое оформление",
      desc: "Бронирование за 30 минут. Наш менеджер поможет с оформлением всех документов",
    },
    {
      icon: MapPin,
      title: "Доставка по Москве",
      desc: "Привезём автомобиль к вашему дому, отелю или в аэропорт",
    },
  ];

  return (
    <>
      {/* Hero Section — без "Премиум-класс" */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background/90 to-background/80">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* ❌ УДАЛЁН блок "Премиум-класс" */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight font-sans">
            Аренда автомобилей{" "}
            <span className="text-accent">премиум-класса</span>{" "}
            в&nbsp;Москве
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-sans">
            Rolls-Royce, Ferrari, Porsche, BMW, Mercedes-Benz — лучшие автомобили для ваших
            особых моментов
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fleet">
              <Button size="lg" className="text-base px-10 font-sans">
                Смотреть автопарк
              </Button>
            </Link>
            <Link href="/conditions">
              <Button variant="outline" size="lg" className="text-base px-10 font-sans">
                Условия аренды
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Наш автопарк */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-sans">Наш автопарк</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
            Выберите автомобиль мечты из нашей коллекции премиальных марок
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={JSON.parse(JSON.stringify(car))} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/fleet">
            <Button variant="outline" size="lg" className="font-sans">
              Весь автопарк
            </Button>
          </Link>
        </div>
      </section>

      {/* Почему мы */}
      <section className="py-16 lg:py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 font-sans">
            Почему мы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="text-center p-8 rounded-xl border border-border bg-background hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 font-sans tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}