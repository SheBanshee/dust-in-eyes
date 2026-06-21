const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Удаляем всех пользователей (опционально)
    await prisma.user.deleteMany();
    console.log(' Все пользователи удалены');

    // Создаём админа
    const admin = await prisma.user.create({
      data: {
        email: 'admin@dustineyes.ru',
        password: '$2a$10$VQygxvX3uRZ3Z8cQNq1e/u6XPXYPFWXQj2NlVJNfGhY1gJzM7lXia',
        name: 'Admin',
        role: 'ADMIN',
      },
    });
    console.log('Админ создан:', admin.email, '—', admin.role);

    // Создаём менеджера
    const manager = await prisma.user.create({
      data: {
        email: 'manager@dustineyes.ru',
        password: '$2a$10$VQygxvX3uRZ3Z8cQNq1e/u6XPXYPFWXQj2NlVJNfGhY1gJzM7lXia',
        name: 'Manager',
        role: 'MANAGER',
      },
    });
    console.log('Менеджер создан:', manager.email, '—', manager.role);

    await prisma.$disconnect();
  } catch (error) {
    console.error('Ошибка:', error);
    await prisma.$disconnect();
  }
}

createAdmin();