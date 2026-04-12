# Clarity - Відкрита платформа онлайн-терапії

Безкоштовна та відкрита альтернатива платформам для онлайн-терапії.

## Можливості

### Для клієнтів
- Пошук терапевтів за спеціалізацією
- Перегляд профілів та відгуків
- Бронювання сесій онлайн
- Чат з терапевтом
- Особистий кабінет

### Для терапевтів
- Профіль з описом послуг
- Управління записами
- Чат з клієнтами
- Перегляд відгуків

## Технології

- **Frontend**: Next.js 14 (App Router)
- **База даних**: Supabase (PostgreSQL)
- **Автентифікація**: Supabase Auth
- **Резервне копіювання**: Supabase Realtime
- **Хостинг**: Vercel (безкоштовно)

## Локальний запуск

```bash
# Клонування репозиторію
git clone https://github.com/vasya-skery/therapy-platform.git
cd therapy-platform

# Встановлення залежностей
npm install

# Створення .env.local
cp .env.example .env.local
# Заповніть:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Запуск
npm run dev
```

## Налаштування Supabase

1. Створіть проект на https://supabase.com
2. Перейдіть до SQL Editor
3. Виконайте код з `supabase/schema.sql`
4. Скопіюйте URL та ключі з Settings > API

## Деплой на Vercel

```bash
# Встановіть Vercel CLI
npm i -g vercel

# Деплой
vercel
```

Або підключіть GitHub репозиторій на https://vercel.com

## Ліцензія

MIT License - використовуйте вільно!

## TODO

- [x] Автентифікація
- [x] Профілі терапевтів
- [x] Каталог терапевтів
- [x] Бронювання сесій
- [x] Чат
- [x] Відгуки
- [ ] Email нотифікації
- [ ] Video conferencing
- [ ] Admin панель
- [ ] Документація API
