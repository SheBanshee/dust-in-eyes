"use client";

import { useState } from "react";
import { Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConsultationModal from "@/components/consultation/ConsultationModal";

export default function ContactsPage() {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">Контакты</h1>
      <p className="text-muted-foreground mb-8">Свяжитесь с нами удобным способом</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Телефон</h3>
                <a
                  href="tel:+74951234567"
                  className="text-lg text-accent hover:text-accent-hover transition-colors"
                >
                  +7 (495) 123-45-67
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Адрес</h3>
                <p className="text-muted-foreground">
                  Москва, Большая Андроновская ул., 23
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Режим работы</h3>
                <p className="text-muted-foreground">Ежедневно, 09:00 — 22:00</p>
              </div>
            </div>
          </div>

          <Button onClick={() => setConsultOpen(true)} size="lg" className="w-full">
            Получить консультацию
          </Button>
        </div>

        <div className="rounded-lg overflow-hidden border border-border h-[400px] lg:h-auto">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=37.705%2C55.737%2C37.715%2C55.742&layer=mapnik&marker=55.7395%2C37.7099"
            className="w-full h-full min-h-[400px]"
            style={{ border: 0 }}
            loading="lazy"
            title="Карта - Большая Андроновская ул., 23"
          />
        </div>
      </div>

      <ConsultationModal open={consultOpen} onOpenChange={setConsultOpen} />
    </div>
  );
}
