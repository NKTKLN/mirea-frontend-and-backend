# Проект: Аутентификация с использованием JWT

Этот проект представляет собой пример реализации аутентификации с использованием JSON Web Tokens (JWT) на Node.js. Проект включает в себя бэкенд на Node.js и фронтенд, который обслуживается через Nginx.

## Структура проекта

- `server.js` — основной файл сервера на Node.js.
- `index.html` — HTML-файл для фронтенда.
- `app.js` — JavaScript-файл для фронтенда.
- `Dockerfile` — Dockerfile для сборки образа Node.js сервера.
- `Dockerfile.nginx` — Dockerfile для сборки образа Nginx.
- `compose.yml` — файл Docker Compose для запуска всех сервисов.
- `.env` — файл для хранения переменных окружения (например, секретного ключа JWT).

## Установка и запуск

### Предварительные требования

1. Убедитесь, что у вас установлены:
   - [Docker](https://docs.docker.com/get-docker/)
   - [Docker Compose](https://docs.docker.com/compose/install/)

### Шаг 1: Клонирование репозитория

Склонируйте репозиторий на ваш компьютер:

```bash
git clone https://github.com/NKTKLN/mirea-frontend-and-backend/tree/main/jwt-auth-example
cd jwt-auth-example
```

### Шаг 2: Настройка переменных окружения

Создайте файл `.env` в корневой директории проекта и добавьте в него секретный ключ для JWT:

```env
JWT_SECRET=ваш_секретный_ключ
```

### Шаг 3: Запуск проекта с Docker Compose

Запустите проект с помощью Docker Compose:

```bash
docker compose up --build
```

Эта команда соберет и запустит контейнеры для Node.js сервера и Nginx.

### Шаг 4: Доступ к приложению

После успешного запуска:

- **Фронтенд (Nginx)** будет доступен на [http://localhost:8080](http://localhost:8080).
- **Бэкенд (Node.js сервер)** будет доступен на [http://localhost:3000](http://localhost:3000).

### Шаг 5: Тестирование

1. Откройте браузер и перейдите по адресу [http://localhost:8080](http://localhost:8080). Вы увидите HTML-страницу с формой регистрации и входа.
2. Используйте формы для регистрации нового пользователя и входа в систему.
3. После успешного входа вы сможете получить доступ к защищенным данным через кнопку "Получить защищенные данные".

### Шаг 6: Остановка контейнеров

Чтобы остановить контейнеры, выполните команду:

```bash
docker compose down
```

