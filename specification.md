# Readme — простой движок для блога

Микросервисный бэкенд для многопользовательского блога на NestJS + NX.

## Архитектура

| Сервис        | Порт | БД                  | Назначение                                                          |
| ------------- | ---- | ------------------- | ------------------------------------------------------------------- |
| `api-gateway` | 3004 | —                   | Точка входа для фронтенда: аутентификация, агрегация, трансформация |
| `users`       | 3000 | MongoDB             | Пользователи, аутентификация, refresh-токены, подписки              |
| `blog`        | 3001 | PostgreSQL + Prisma | Публикации, комментарии, лайки, поиск, лента                        |
| `files`       | 3002 | ФС                  | Загрузка и отдача файлов                                            |
| `notify`      | 3003 | MongoDB + RabbitMQ  | Рассылка email о новых публикациях                                  |

## Требования

- Node.js LTS (20+)
- Docker + Docker Compose
- npm

## Запуск инфраструктуры

### users (MongoDB)

```bash
cd apps/users
docker compose up -d
```

MongoDB на `localhost:27017`, mongo-express на `localhost:8081`.

### blog (PostgreSQL + PgAdmin)

```bash
cd apps/blog
docker compose up -d
```

PostgreSQL на `localhost:5432`, PgAdmin на `localhost:5050`.

### notify (RabbitMQ + fake-smtp-server + MongoDB)

```bash
cd apps/notify
docker compose up -d
```

RabbitMQ на `localhost:5672` (management UI `localhost:15672`), fake-smtp-server на `localhost:8025` (UI `localhost:1083`), MongoDB на `localhost:27020`.

## Переменные окружения

В каждом сервисе есть `.env.example` — скопируй в `.env`:

```bash
cp apps/users/.env.example apps/users/.env
cp apps/blog/.env.example apps/blog/.env
cp apps/notify/.env.example apps/notify/.env
cp apps/api-gateway/.env.example apps/api-gateway/.env
```

Также нужен корневой `.env` с `DATABASE_URL` для Prisma CLI (blog):

```bash
cp .env.example .env
```

## Установка зависимостей

```bash
npm install
```

## Миграции и seed (blog)

```bash
npx nx run blog:db-generate
npx nx run blog:db-migrate --name init
npx nx run blog:db-fill
```

## Запуск сервисов

В отдельных терминалах:

```bash
npx nx serve users
npx nx serve blog
npx nx serve files
npx nx serve notify
npx nx serve api-gateway
```

Или одной командой:

```bash
npx nx run-many -t serve -p users blog files notify api-gateway
```

## Swagger

- api-gateway: http://localhost:3004/docs
- users: http://localhost:3000/docs
- blog: http://localhost:3001/docs
- files: http://localhost:3002/docs
- notify: http://localhost:3003/docs

## HTTP-запросы для тестирования

В корне каждого сервиса лежит `<service>.http` (users.http, blog.http, notify.http, api-gateway.http) — открой в VS Code с расширением REST Client.

## Основные сценарии

- Регистрация/вход/refresh/logout — `api-gateway` → `users`
- CRUD публикаций, комментарии, лайки, поиск — `api-gateway` → `blog`
- Загрузка файлов — `api-gateway` → `files`
- Рассылка email — `notify` (триггер через `POST /api/notify/trigger`)
- Лента пользователя — `api-gateway` → `users` (подписки) + `blog` (посты)
