"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConsultationModal from "@/components/consultation/ConsultationModal";
import { cn } from "@/lib/utils";

export default function ConditionsPage() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("conditions");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">Условия аренды</h1>
      <p className="text-muted-foreground mb-8">
        Ознакомьтесь с условиями аренды и основными правилами
      </p>

      <div className="space-y-4">
        {/* Минимальные условия аренды */}
        <div className="border border-border rounded-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-6 text-left hover:bg-card transition-colors cursor-pointer"
            onClick={() => setOpenSection(openSection === "conditions" ? null : "conditions")}
          >
            <h2 className="text-xl font-semibold">
              Минимальные условия аренды и необходимые документы
            </h2>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-muted transition-transform",
                openSection === "conditions" && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              openSection === "conditions" ? "max-h-[800px]" : "max-h-0"
            )}
          >
            <div className="px-6 pb-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg p-5 border border-border">
                  <h3 className="text-accent font-semibold mb-3">Возраст</h3>
                  <p className="text-2xl font-bold mb-1">от 20 лет</p>
                  <p className="text-sm text-muted-foreground">
                    Рассмотрение в индивидуальном порядке
                  </p>
                </div>
                <div className="bg-card rounded-lg p-5 border border-border">
                  <h3 className="text-accent font-semibold mb-3">Водительский опыт</h3>
                  <p className="text-2xl font-bold mb-1">от 1 года</p>
                  <p className="text-sm text-muted-foreground">
                    Рассмотрение в индивидуальном порядке
                  </p>
                </div>
              </div>
              <Button onClick={() => setConsultOpen(true)}>Получить консультацию</Button>
            </div>
          </div>
        </div>

        {/* Основные правила */}
        <div className="border border-border rounded-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-6 text-left hover:bg-card transition-colors cursor-pointer"
            onClick={() => setOpenSection(openSection === "rules" ? null : "rules")}
          >
            <h2 className="text-xl font-semibold">Основные правила</h2>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-muted transition-transform",
                openSection === "rules" && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              openSection === "rules" ? "max-h-[2000px]" : "max-h-0"
            )}
          >
            <div className="px-6 pb-6 space-y-6">
              {/* Лимиты по пробегу */}
              <div className="bg-card rounded-lg p-5 border border-border">
                <h3 className="text-accent font-semibold mb-3">Лимиты по пробегу</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>200-250 км/сутки (в зависимости от класса авто)</li>
                  <li>Лимит суммируется (при аренде от 2-х суток)</li>
                  <li>За перепробег предусмотрена доплата (размер зависит от авто)</li>
                </ul>
              </div>

              {/* Стоимость доставки */}
              <div className="bg-card rounded-lg p-5 border border-border">
                <h3 className="text-accent font-semibold mb-3">
                  Стоимость доставки/возврата авто по адресу
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex justify-between">
                    <span>в пределах МКАД</span>
                    <span className="font-medium text-foreground">3 000 ₽</span>
                  </li>
                  <li className="flex justify-between">
                    <span>в аэропорты</span>
                    <span className="font-medium text-foreground">5 000 ₽</span>
                  </li>
                  <li className="flex justify-between">
                    <span>до 20 км от МКАД</span>
                    <span className="font-medium text-foreground">5 000 ₽</span>
                  </li>
                  <li className="flex justify-between">
                    <span>более 20 км от МКАД</span>
                    <span className="font-medium text-foreground">от 5 000 ₽</span>
                  </li>
                </ul>
              </div>

              {/* Залог */}
              <div className="bg-card rounded-lg p-5 border border-border">
                <h3 className="text-accent font-semibold mb-3">Залог</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Размер зависит от марки и модели авто</li>
                  <li>
                    Основную часть возвращаем сразу (по факту возврата и осмотра автомобиля)
                  </li>
                  <li>
                    10 000 ₽ удерживаем на 14 дней (на случай возможных штрафов)
                  </li>
                  <li>Может быть отменён при подключении услуги «100% Защита»</li>
                </ul>
              </div>

              {/* Территория */}
              <div className="bg-card rounded-lg p-5 border border-border">
                <h3 className="text-accent font-semibold mb-3">Территория эксплуатации</h3>
                <p className="text-muted-foreground">
                  Вся Россия (регионы обсуждаются при формировании договора)
                </p>
              </div>

              {/* Расчётное время */}
              <div className="bg-card rounded-lg p-5 border border-border">
                <h3 className="text-accent font-semibold mb-3">Расчётное время</h3>
                <p className="text-muted-foreground">
                  24 часа. Начинается с момента передачи автомобиля.
                </p>
              </div>

              {/* Способы оплаты */}
              <div className="bg-card rounded-lg p-5 border border-border">
                <h3 className="text-accent font-semibold mb-3">Способы оплаты</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Банковской картой</li>
                  <li>По QR коду</li>
                  <li>Наличными</li>
                </ul>
                <p className="mt-3 text-sm text-muted">
                  Залог, так как он возвращаемый, можем принять только двумя способами:
                  наличными или по QR коду.
                </p>
              </div>

              {/* Возврат авто */}
              <div className="bg-card rounded-lg p-5 border border-border">
                <h3 className="text-accent font-semibold mb-3">Возврат автомобиля</h3>
                <p className="text-muted-foreground">
                  Автомобиль выдаётся чистым и заправленным. Вернуть авто необходимо в таком
                  же состоянии, либо доплатить за мойку и топливо.
                </p>
              </div>

              <Button onClick={() => setConsultOpen(true)}>Получить консультацию</Button>
            </div>
          </div>
        </div>
      </div>

      <ConsultationModal open={consultOpen} onOpenChange={setConsultOpen} />
    </div>
  );
}
