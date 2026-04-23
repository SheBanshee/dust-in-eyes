import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&q=80"
            alt="Премиальный автомобиль"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
        </div>

        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-6">О компании</h1>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p className="text-xl text-foreground font-medium">
              Мы — ваш ключ к миру роскоши и безупречного стиля.
            </p>
            <p>
              Наша компания специализируется на аренде автомобилей премиум-класса в Москве.
              Мы предлагаем клиентам не просто транспорт, а настоящий опыт — элегантный,
              комфортный и запоминающийся.
            </p>
            <p>
              В нашем автопарке представлены культовые бренды: Rolls-Royce, Ferrari, Maserati,
              BMW, Mercedes-Benz, Porsche и другие.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { value: "50+", label: "Авто в парке" },
              { value: "1000+", label: "Клиентов" },
              { value: "5 лет", label: "На рынке" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 bg-card border border-border rounded-lg"
              >
                <p className="text-2xl font-bold text-accent">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
