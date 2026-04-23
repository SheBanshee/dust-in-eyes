import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Пыль в глаза — Аренда премиальных автомобилей в Москве",
  description:
    "Аренда автомобилей премиум-класса в Москве. Rolls-Royce, Ferrari, Porsche, BMW, Mercedes-Benz и другие.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <Providers>
          <Header />
          <main className="flex-1 pt-16 lg:pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
