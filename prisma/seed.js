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
    deposit: 10000,
    description: "BMW 520d — элегантный бизнес-седан с дизельным двигателем. Идеальное сочетание комфорта, динамики и экономичности. Премиальный интерьер, передовые технологии и безупречный стиль.",
    bodyType: "sedan",
    doors: 4,
    color: "Alpine White",
    screenshot: "/cars/BMW520d.png",
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
    deposit: 10000,
    description: "BMW X5 M50d — мощный премиальный кроссовер с невероятной динамикой. Полный привод, роскошный салон и передовые системы безопасности для максимального комфорта.",
    bodyType: "suv",
    doors: 4,
    color: "Dark Graphite",
    screenshot: "/cars/BMWX5.png",
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
    deposit: 10000,
    description: "Mercedes-Benz S-Class — эталон роскоши и технологий. Флагманский седан с непревзойдённым уровнем комфорта, инновационной подвеской и салоном, который задаёт стандарты в автоиндустрии.",
    bodyType: "sedan",
    doors: 4,
    color: "Obsidian Black",
    screenshot: "/cars/MercedesSClass.png",
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
    deposit: 10000,
    description: "Mercedes-Benz G63 AMG — икона стиля и мощи. Легендарный внедорожник с двигателем V8, брутальным дизайном и роскошным интерьером. Символ статуса и силы.",
    bodyType: "suv",
    doors: 4,
    color: "Magno Grey",
    screenshot: "/cars/MercedesG63.png",
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
    deposit: 10000,
    description: "Porsche 911 Carrera S — легенда спортивных автомобилей. Непревзойдённая динамика, точное управление и узнаваемый силуэт. Каждая поездка — это событие.",
    bodyType: "coupe",
    doors: 2,
    color: "Gentian Blue",
    screenshot: "/cars/Porsche911.png",
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
    deposit: 10000,
    description: "Porsche Cayenne Turbo — спортивный премиальный кроссовер. Мощнейший двигатель, адаптивная подвеска и интерьер, достойный суперкара.",
    bodyType: "suv",
    doors: 4,
    color: "Carrara White",
    screenshot: "/cars/PorscheCayenne.png",
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
    deposit: 10000,
    description: "Rolls-Royce Ghost — воплощение абсолютной роскоши. Бесшумный V12, ручная отделка салона и совершенство в каждой детали. Автомобиль для тех, кто ценит лучшее.",
    bodyType: "sedan",
    doors: 4,
    color: "Selby Silver",
    screenshot: "/cars/RollsRoyceGhost.png",
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
    deposit: 10000,
    description: "Ferrari Roma — итальянская элегантность и невероятная мощь. Купе класса GT с двигателем V8, молниеносным разгоном и утончённым дизайном la nuova dolce vita.",
    bodyType: "coupe",
    doors: 2,
    color: "Rosso Corsa",
    screenshot: "/cars/FerrariRoma.png",
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
    deposit: 10000,
    description: "Maserati Ghibli — итальянский характер в каждой детали. Спортивный седан с потрясающим звуком двигателя, роскошным салоном и уникальным итальянским стилем.",
    bodyType: "sedan",
    doors: 4,
    color: "Blu Emozione",
    screenshot: "/cars/MaseratiGhibli.png",
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
    deposit: 10000,
    description: "Audi RS6 Avant — суперкар в кузове универсал. Невероятная мощность двигателя V8, полный привод quattro и практичность на каждый день.",
    bodyType: "wagon",
    doors: 4,
    color: "Sonoma Green",
    screenshot: "/cars/AudiRS6.png",
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
    deposit: 10000,
    description: "Range Rover Autobiography — вершина роскоши среди внедорожников. Непревзойдённый комфорт, королевский интерьер и уверенность на любой дороге.",
    bodyType: "suv",
    doors: 4,
    color: "Charente Grey",
    screenshot: "/cars/RangeRover.png",
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
    deposit: 10000,
    description: "Lamborghini Huracán EVO — чистый адреналин. Атмосферный V10, полный привод и дизайн из будущего. Суперкар, который невозможно не заметить.",
    bodyType: "coupe",
    doors: 2,
    color: "Verde Mantis",
    screenshot: "/cars/LamborghiniHuracan.png",
  },
];

async function main() {
  console.log("Seeding database...");

  // ===== ОЧИСТКА ПЕРЕД ЗАПОЛНЕНИЕМ (НАВСЕГДА УБИРАЕТ ДУБЛИ) =====
  await prisma.booking.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();

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

  const managerPassword = await bcrypt.hash("manager123", 10);
  await prisma.user.upsert({
    where: { email: "manager@dustineyes.ru" },
    update: {},
    create: {
      email: "manager@dustineyes.ru",
      name: "Менеджер",
      password: managerPassword,
      role: "MANAGER",
    },
  });
  console.log("Manager user created: manager@dustineyes.ru / manager123");

  for (const carData of cars) {
    const { screenshot, ...carInfo } = carData;
    const car = await prisma.car.create({ data: carInfo });
    console.log(`Created car: ${car.brand} ${car.model} (${car.color})`);
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