import Link from "next/link";
import { Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
                П
              </div>
              <span className="text-lg font-bold">Пыль в глаза</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Аренда автомобилей премиум-класса в Москве. Роскошь, комфорт и незабываемые впечатления.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-accent">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/fleet" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Автопарк
                </Link>
              </li>
              <li>
                <Link href="/conditions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Условия аренды
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-accent">Клиентам</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/signin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Личный кабинет
                </Link>
              </li>
              <li>
                <Link href="/conditions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Правила аренды
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-accent">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-accent" />
                <a href="tel:+74951234567" className="hover:text-foreground transition-colors">
                  +7 (495) 123-45-67
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-accent mt-0.5" />
                <span>Москва, Большая Андроновская ул., 23</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} Пыль в глаза. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
