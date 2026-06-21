export const dynamic = "force-dynamic";

import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Users, Car, Award, Truck } from "lucide-react";

export default async function AboutPage() {
  // Получаем реальные данные из базы
  const [carsCount, usersCount, consultationsCount] = await Promise.all([
    prisma.car.count({ where: { available: true } }),
    prisma.user.count(),
    prisma.consultation.count(),
  ]);

  // Статистика на основе реальных данных
  const stats = [
    { 
      label: "Авто в парке", 
      value: carsCount, 
      icon: Car,
      suffix: "",
      description: "доступно для аренды"
    },
    { 
      label: "Довольных клиентов", 
      value: usersCount, 
      icon: Users,
      suffix: "+",
      description: "зарегистрированных пользователей"
    },
    { 
      label: "На рынке", 
      value: 5, 
      icon: Award,
      suffix: " лет",
      description: "успешной работы"
    },
    { 
      label: "Консультаций", 
      value: consultationsCount, 
      icon: Truck,
      suffix: "",
      description: "проведено"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
      {/* Hero секция с фото */}
      <div className="relative rounded-2xl overflow-hidden mb-12 h-[300px] lg:h-[400px]">
        <Image
          src="/About_us.png"
          alt="Автомобильный салон Пыль в глаза"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-3xl lg:text-5xl font-bold mb-2">О компании</h1>
          <p className="text-lg opacity-90">Премиальная аренда автомобилей в Москве</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
          <Image
            src="/About_us.png"
            alt="Наш автосалон"
            fill
            className="object-cover"
          />
        </div>
        
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-accent">Пыль в глаза</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Мы — ваш ключ к миру роскоши и безупречного стиля.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Наша компания специализируется на аренде автомобилей премиум-класса в Москве. 
            Мы предлагаем клиентам не просто транспорт, а настоящий опыт — элегантный, 
            комфортный и запоминающийся.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            В нашем автопарке представлены культовые бренды: Rolls-Royce, Ferrari, Maserati, 
            BMW, Mercedes-Benz, Porsche и другие.
          </p>
        </div>
      </div>

      {/* Статистика в реальном времени */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
  <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-accent/50 transition-all group">
    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-all">
      <Car className="w-7 h-7 text-accent" />
    </div>
    <p className="text-3xl lg:text-4xl font-bold text-accent">{carsCount}</p>
    <p className="text-sm font-medium mt-2">Авто в парке</p>
    <p className="text-xs text-muted-foreground mt-1">доступно для аренды</p>
  </div>
  
  <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-accent/50 transition-all group">
    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-all">
      <Users className="w-7 h-7 text-accent" />
    </div>
    <p className="text-3xl lg:text-4xl font-bold text-accent">{usersCount}+</p>
    <p className="text-sm font-medium mt-2">Зарегистрированных пользователей</p>
    <p className="text-xs text-muted-foreground mt-1">на сайте</p>
  </div>
  
  <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-accent/50 transition-all group">
    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-all">
      <span className="text-2xl font-bold text-accent">&lt;1</span>
    </div>
    <p className="text-3xl lg:text-4xl font-bold text-accent">1</p>
    <p className="text-sm font-medium mt-2">На рынке</p>
    <p className="text-xs text-muted-foreground mt-1">менее года</p>
  </div>

  <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-accent/50 transition-all group">
    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-all">
      <Truck className="w-7 h-7 text-accent" />
    </div>
    <p className="text-3xl lg:text-4xl font-bold text-accent">{consultationsCount}</p>
    <p className="text-sm font-medium mt-2">Консультаций</p>
    <p className="text-xs text-muted-foreground mt-1">проведено</p>
  </div>
</div>

      {/* Преимущества */}
      <div className="bg-card border border-border rounded-2xl p-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8">Наши преимущества</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg border border-border bg-background hover:border-accent/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Car className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-accent">Только премиум</h3>
            <p className="text-muted-foreground text-sm">Лучшие марки автомобилей</p>
          </div>
          <div className="text-center p-6 rounded-lg border border-border bg-background hover:border-accent/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent">30'</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-accent">Быстрое оформление</h3>
            <p className="text-muted-foreground text-sm">Бронирование за 30 минут</p>
          </div>
          <div className="text-center p-6 rounded-lg border border-border bg-background hover:border-accent/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-accent">Доставка по Москве</h3>
            <p className="text-muted-foreground text-sm">Привезём к вашему дому, отелю или в аэропорт</p>
          </div>
        </div>
      </div>
    </div>
  );
}