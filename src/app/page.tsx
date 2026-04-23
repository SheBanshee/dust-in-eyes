export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import CarCarousel from "@/components/cars/CarCarousel";

export default async function HomePage() {
  const cars = await prisma.car.findMany({
    where: { available: true },
    include: { images: true },
    take: 12,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Аренда автомобилей{" "}
            <span className="text-accent">премиум-класса</span>{" "}
            в&nbsp;Москве
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rolls-Royce, Ferrari, Porsche, BMW, Mercedes-Benz — лучшие автомобили для ваших
            особых моментов
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fleet">
              <Button size="lg" className="text-base px-10">
                Смотреть автопарк
              </Button>
            </Link>
            <Link href="/conditions">
              <Button variant="outline" size="lg" className="text-base px-10">
                Условия аренды
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Car Carousel */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Наш автопарк</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Выберите автомобиль мечты из нашей коллекции премиальных марок
          </p>
        </div>
        <CarCarousel cars={JSON.parse(JSON.stringify(cars))} />
        <div className="text-center mt-10">
          <Link href="/fleet">
            <Button variant="outline" size="lg">
              Весь автопарк
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 lg:py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">Почему мы</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Премиальный автопарк",
                desc: "Только лучшие марки — Rolls-Royce, Ferrari, Porsche, BMW, Mercedes-Benz и другие",
              },
              {
                title: "Быстрое оформление",
                desc: "Бронирование за 30 минут. Наш менеджер поможет с оформлением всех документов",
              },
              {
                title: "Доставка по Москве",
                desc: "Привезём автомобиль к вашему дому, отелю или в аэропорт",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-lg border border-border bg-background hover:border-accent/50 transition-all"
              >
                <h3 className="text-xl font-semibold mb-3 text-accent">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
