# Пыль в глаза — Аренда премиальных автомобилей

Сайт аренды автомобилей премиум-класса в Москве.

## Стек

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** + Shadcn/ui
- **Prisma** ORM + MySQL
- **NextAuth.js** (Email, Yandex OAuth, VK OAuth)
- **MinIO** (S3-совместимое хранилище)
- **Docker Compose**

## Быстрый старт

### 1. Через Docker (рекомендуется)

```bash
# Клонировать и перейти в директорию
cd dust-in-eyes

# Скопировать env файл
cp .env.example .env

# Запустить все сервисы
docker compose up -d

# Применить миграции и seed-данные
docker compose exec app npx prisma db push
docker compose exec app npm run db:seed
```

Сайт: http://localhost:3000
MinIO Console: http://localhost:9001 (minioadmin/minioadmin)

### 2. Локальная разработка

```bash
# Установить зависимости
npm install

# Запустить MySQL и MinIO через Docker
docker compose up db minio createbuckets -d

# Применить схему к БД
npx prisma db push

# Заполнить данными
npm run db:seed

# Запустить dev-сервер
npm run dev
```

## Аккаунты

- **Админ**: admin@dustineyes.ru / admin123

## Структура

| Страница | URL |
|---|---|
| Главная | `/` |
| Автопарк | `/fleet` |
| Карточка авто | `/fleet/:id` |
| Условия аренды | `/conditions` |
| О компании | `/about` |
| Контакты | `/contacts` |
| Вход/Регистрация | `/auth/signin` |
| Личный кабинет | `/profile` |
| Админ-панель | `/admin` |

## OAuth

Для Яндекс и ВК OAuth заполните в `.env`:

```
AUTH_YANDEX_ID=your_yandex_app_id
AUTH_YANDEX_SECRET=your_yandex_app_secret
AUTH_VK_ID=your_vk_app_id
AUTH_VK_SECRET=your_vk_app_secret
```
