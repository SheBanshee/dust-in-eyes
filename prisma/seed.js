const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const cars = [
  {
    brand: "BMW",
    model: "520d",
    year: 2023,
    seats: 5,
    fuelType: "Дизель",
    horsepower: 190,
    drivetrain: "Задний",
    engineVolume: 2.0,
    pricePerDay: 12000,
    description:
      "BMW 520d — элегантный бизнес-седан с дизельным двигателем. Идеальное сочетание комфорта, динамики и экономичности. Премиальный интерьер, передовые технологии и безупречный стиль.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
    ],
  },
  {
    brand: "BMW",
    model: "X5 M50d",
    year: 2024,
    seats: 5,
    fuelType: "Дизель",
    horsepower: 400,
    drivetrain: "Полный",
    engineVolume: 3.0,
    pricePerDay: 25000,
    description:
      "BMW X5 M50d — мощный премиальный кроссовер с невероятной динамикой. Полный привод, роскошный салон и передовые системы безопасности для максимального комфорта.",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
    ],
  },
  {
    brand: "Mercedes-Benz",
    model: "S-Class W223",
    year: 2024,
    seats: 5,
    fuelType: "Бензин",
    horsepower: 503,
    drivetrain: "Полный",
    engineVolume: 4.0,
    pricePerDay: 35000,
    description:
      "Mercedes-Benz S-Class — эталон роскоши и технологий. Флагманский седан с непревзойдённым уровнем комфорта, инновационной подвеской и салоном, который задаёт стандарты в автоиндустрии.",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
    ],
  },
  {
    brand: "Mercedes-Benz",
    model: "G63 AMG",
    year: 2024,
    seats: 5,
    fuelType: "Бензин",
    horsepower: 585,
    drivetrain: "Полный",
    engineVolume: 4.0,
    pricePerDay: 45000,
    description:
      "Mercedes-Benz G63 AMG — икона стиля и мощи. Легендарный внедорожник с двигателем V8, брутальным дизайном и роскошным интерьером. Символ статуса и силы.",
    images: [
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80",
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80",
    ],
  },
  {
    brand: "Porsche",
    model: "911 Carrera S",
    year: 2024,
    seats: 4,
    fuelType: "Бензин",
    horsepower: 450,
    drivetrain: "Задний",
    engineVolume: 3.0,
    pricePerDay: 40000,
    description:
      "Porsche 911 Carrera S — легенда спортивных автомобилей. Непревзойдённая динамика, точное управление и узнаваемый силуэт. Каждая поездка — это событие.",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    ],
  },
  {
    brand: "Porsche",
    model: "Cayenne Turbo",
    year: 2024,
    seats: 5,
    fuelType: "Бензин",
    horsepower: 640,
    drivetrain: "Полный",
    engineVolume: 4.0,
    pricePerDay: 35000,
    description:
      "Porsche Cayenne Turbo — спортивный премиальный кроссовер. Мощнейший двигатель, адаптивная подвеска и интерьер, достойный суперкара.",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    ],
  },
  {
    brand: "Rolls-Royce",
    model: "Ghost",
    year: 2023,
    seats: 5,
    fuelType: "Бензин",
    horsepower: 571,
    drivetrain: "Полный",
    engineVolume: 6.75,
    pricePerDay: 80000,
    description:
      "Rolls-Royce Ghost — воплощение абсолютной роскоши. Бесшумный V12, ручная отделка салона и совершенство в каждой детали. Автомобиль для тех, кто ценит лучшее.",
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
      "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80",
    ],
  },
  {
    brand: "Ferrari",
    model: "Roma",
    year: 2024,
    seats: 2,
    fuelType: "Бензин",
    horsepower: 620,
    drivetrain: "Задний",
    engineVolume: 3.9,
    pricePerDay: 70000,
    description:
      "Ferrari Roma — итальянская элегантность и невероятная мощь. Купе класса GT с двигателем V8, молниеносным разгоном и утончённым дизайном la nuova dolce vita.",
    images: [
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
    ],
  },
  {
    brand: "Maserati",
    model: "Ghibli",
    year: 2023,
    seats: 5,
    fuelType: "Бензин",
    horsepower: 350,
    drivetrain: "Задний",
    engineVolume: 3.0,
    pricePerDay: 25000,
    description:
      "Maserati Ghibli — итальянский характер в каждой детали. Спортивный седан с потрясающим звуком двигателя, роскошным салоном и уникальным итальянским стилем.",
    images: [
      "https://images.unsplash.com/photo-1580274455191-1c62238ce452?w=800&q=80",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
    ],
  },
  {
    brand: "Audi",
    model: "RS6 Avant",
    year: 2024,
    seats: 5,
    fuelType: "Бензин",
    horsepower: 600,
    drivetrain: "Полный",
    engineVolume: 4.0,
    pricePerDay: 30000,
    description:
      "Audi RS6 Avant — суперкар в кузове универсал. Невероятная мощность двигателя V8, полный привод quattro и практичность на каждый день.",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80",
    ],
  },
  {
    brand: "Range Rover",
    model: "Autobiography",
    year: 2024,
    seats: 5,
    fuelType: "Бензин",
    horsepower: 530,
    drivetrain: "Полный",
    engineVolume: 4.4,
    pricePerDay: 40000,
    description:
      "Range Rover Autobiography — вершина роскоши среди внедорожников. Непревзойдённый комфорт, королевский интерьер и уверенность на любой дороге.",
    images: [
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80",
      "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=800&q=80",
    ],
  },
  {
    brand: "Lamborghini",
    model: "Huracán EVO",
    year: 2024,
    seats: 2,
    fuelType: "Бензин",
    horsepower: 640,
    drivetrain: "Полный",
    engineVolume: 5.2,
    pricePerDay: 90000,
    description:
      "Lamborghini Huracán EVO — чистый адреналин. Атмосферный V10, полный привод и дизайн из будущего. Суперкар, который невозможно не заметить.",
    images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@dustineyes.ru" },
    update: {},
    create: {
      email: "admin@dustineyes.ru",
      name: "Администратор",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin user created: admin@dustineyes.ru / admin123");

  for (const carData of cars) {
    const { images, ...carInfo } = carData;
    const car = await prisma.car.create({ data: carInfo });

    for (let i = 0; i < images.length; i++) {
      await prisma.carImage.create({
        data: {
          carId: car.id,
          url: images[i],
          isPrimary: i === 0,
          displayOrder: i,
        },
      });
    }
    console.log(`Created car: ${car.brand} ${car.model}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
