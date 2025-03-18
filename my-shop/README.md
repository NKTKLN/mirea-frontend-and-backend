# Интернет-магазин

Этот проект представляет собой одностраничное приложение (SPA) интернет-магазина, разработанное с использованием React, Redux Toolkit и Material-UI. Приложение поддерживает фильтрацию, сортировку, поиск товаров, а также функциональность корзины.

## Основные функции

- Отображение товаров с карточками.
- Добавление товаров в корзину.
- Переключение между светлой и темной темами.
- Локальное кэширование состояния корзины.

## Установка и запуск

### Требования

- Docker и Docker Compose должны быть установлены на вашем компьютере.

### Запуск с помощью Docker

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/NKTKLN/mirea-frontend-and-backend
   cd my-shop
   ```

2. Запустите приложение с помощью Docker Compose:
   ```bash
   docker compose up --build
   ```

3. Откройте браузер и перейдите по адресу:
   - Приложение: `http://localhost`
   - Mock API: `http://localhost:3001/products`

### Запуск без Docker

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Запустите mock API:
   ```bash
   npx json-server --watch public/data.json --port 3001
   ```

3. Запустите приложение:
   ```bash
   npm run dev
   ```

4. Откройте браузер и перейдите по адресу:
   - Приложение: `http://localhost:5173`

## Используемые технологии

- **Frontend**: React, Redux Toolkit, Material-UI, Framer Motion.
- **Mock API**: json-server.
- **DevOps**: Docker, Docker Compose, Nginx.
