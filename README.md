# Task Management API

## Опис проекту

Проект представляє собою мікросервісну архітектуру для управління завданнями (Task Management System). Система складається з двох незалежних сервісів, які взаємодіють між собою через HTTP API.

## Архітектура

Проект реалізований як мікросервісна архітектура з двома основними сервісами:

### 1. Tasks Service (Сервіс завдань)
Відповідає за управління завданнями користувачів.

**API Endpoints:**
- `GET /tasks` - отримати всі завдання
- `GET /tasks/:id` - отримати завдання за ID
- `POST /tasks` - створити нове завдання
- `PUT /tasks/:id` - оновити завдання
- `DELETE /tasks/:id` - видалити завдання
- `GET /tasks/user/:userId` - отримати завдання користувача

### 2. Users Service (Сервіс користувачів)
Відповідає за управління користувачами системи.

**API Endpoints:**
- `GET /users` - отримати всіх користувачів
- `GET /users/:id` - отримати користувача за ID
- `POST /users` - створити нового користувача
- `PUT /users/:id` - оновити користувача
- `DELETE /users/:id` - видалити користувача
- `GET /users/:id/tasks` - отримати завдання користувача (інтеграція з Tasks Service)

## Технології

- **Node.js** - серверна платформа
- **Fastify** - швидкий веб-фреймворк для створення API
- **SQLite** - файлова база даних (better-sqlite3)
- **Jest** - фреймворк для тестування
- **ESLint** - лінтер для перевірки коду
- **Prettier** - форматтер коду
- **GitHub Actions** - CI/CD пайплайни

## Структура проекту

```
nodejs-project/
├── services/
│   ├── tasks-service/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── database/
│   │   │   ├── app.js
│   │   │   └── server.js
│   │   ├── tests/
│   │   └── README.md
│   └── users-service/
│       ├── src/
│       │   ├── controllers/
│       │   ├── models/
│       │   ├── repositories/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── clients/
│       │   ├── database/
│       │   ├── app.js
│       │   └── server.js
│       ├── tests/
│       └── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── COMPONENT_DIAGRAM.md
│   ├── ER_DIAGRAM.md
│   ├── DATA_SCENARIOS.md
│   └── DIAGRAMS.md
├── data/
│   ├── tasks.db
│   └── users.db
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── .husky/
│   ├── pre-commit
│   ├── pre-push
│   └── commit-msg
├── package.json
├── README.md
└── .gitignore
```

## Основні сценарії використання

1. **Створення користувача та завдання**
   - Користувач реєструється в системі через Users Service
   - Користувач створює завдання через Tasks Service
   - Завдання пов'язується з користувачем

2. **Перегляд та управління завданнями**
   - Користувач може переглядати всі свої завдання
   - Користувач може оновлювати статус завдання
   - Користувач може видаляти завдання

3. **Інтеграція між сервісами**
   - Users Service може запитувати завдання користувача через Tasks Service
   - Tasks Service валідує існування користувача через Users Service

## Плани розробки

### Лабораторна робота № 0 ✅
- [x] Вибір ідеї
- [x] Створення репозиторію
- [x] Детальний опис ідеї в README.md

### Лабораторна робота № 1 ✅
- [x] Налаштування пакетів
- [x] Вибір стилю коду (ESLint + Prettier)
- [x] Налаштування форматтера (Prettier)
- [x] Налаштування лінтера (ESLint)
- [x] Налаштування Git-hooks (pre-commit, pre-push, commit-msg)

### Лабораторна робота № 2 ✅
- [x] Розділення додатку на компоненти/модулі
- [x] Діаграма компонентів ПЗ
- [x] ER-діаграма даних
- [x] Опис сценаріїв оновлення/зміни/агрегації даних

**Документація:**
- [Архітектура системи](docs/ARCHITECTURE.md)
- [Діаграма компонентів](docs/COMPONENT_DIAGRAM.md)
- [ER-діаграма](docs/ER_DIAGRAM.md)
- [Сценарії роботи з даними](docs/DATA_SCENARIOS.md)
- [Візуальні діаграми (Mermaid)](docs/DIAGRAMS.md)

### Лабораторна робота № 3 ✅
- [x] Імплементація основних сценаріїв зі статичними даними
- [x] Реалізація API endpoints для обох сервісів

**Реалізовано:**
- Tasks Service з 6 endpoints (GET /tasks, GET /tasks/:id, GET /tasks/user/:userId, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id)
- Users Service з 6 endpoints (GET /users, GET /users/:id, GET /users/:id/tasks, POST /users, PUT /users/:id, DELETE /users/:id)
- Валідація даних
- Інтеграція між сервісами (Users Service → Tasks Service)
- Агрегація статистики для завдань користувача

### Лабораторна робота № 4 ✅
- [x] Інтеграція з базою даних (SQLite)
- [x] Заміна статичних даних на реальну роботу з БД

**Реалізовано:**
- Підключення до SQLite через `better-sqlite3`
- Створення таблиць Users та Tasks
- Оновлення репозиторіїв для роботи з SQLite
- Автоматична ініціалізація БД при запуску
- Початкові дані в БД

### Лабораторна робота № 5 ✅
- [x] Unit-тести для модулів (ValidationService - 100% покриття)
- [x] Інтеграційні тести (TasksRepository з БД без HTTP)
- [x] E2E тести (HTTP API через Fastify inject)
- [x] Мутаційне тестування та репорт

**Реалізовано:**
- 29 Unit-тестів для ValidationService (Tasks та Users)
  - Повне покриття ValidationService з усіма edge cases
  - Підтримка валідації для create та update операцій
- 19 інтеграційних тестів для TasksRepository
  - Тестування реальної роботи з SQLite БД
  - Перевірка всіх CRUD операцій
  - Перевірка маппінгу даних та timestamp полів
- 16 E2E тестів для Tasks Service API
  - Покриття всіх HTTP endpoints
  - Тестування повного життєвого циклу задач
  - Обробка помилок та edge cases
- Налаштування Stryker для мутаційного тестування
- Детальний звіт про тестування

**Статистика:**
- Всього тестів: 64 (29 unit + 19 integration + 16 e2e)
- Покриття ValidationService: 100% (Tasks та Users)
- Покриття TasksRepository: високе (через інтеграційні тести)
- Покриття TasksController: високе (через E2E тести)
- Всі тести проходять успішно

**Документація:**
- [Testing Report](docs/TESTING_REPORT.md)

### Лабораторна робота № 6
- [ ] Налаштування CI (GitHub Actions)
- [ ] Налаштування CD (автоматичне розгортання)
- [ ] Розгортання на Stage-сервері

## Запуск проекту

```bash
# Встановлення залежностей
npm install

# Запуск Tasks Service (термінал 1)
npm run start:tasks

# Запуск Users Service (термінал 2)
npm run start:users
```

**Важливо:** Обидва сервіси повинні працювати одночасно. Tasks Service працює на порту 3001, Users Service на порту 3002.

## База даних

Проект використовує SQLite - файлову базу даних, яка не потребує окремого сервера. Бази даних автоматично створюються при першому запуску сервісів в папці `data/`:
- `data/tasks.db` - база даних для Tasks Service
- `data/users.db` - база даних для Users Service

## Тестування

```bash
# Запуск всіх тестів
npm test

# Запуск Unit-тестів
npm run test:unit

# Запуск Integration-тестів
npm run test:integration

# Запуск E2E-тестів
npm run test:e2e

# Запуск з покриттям коду
npm run test:coverage

# Мутаційне тестування
npm run test:mutation
```

**Статистика тестів:**
- Unit-тести: 29 тестів (ValidationService - повне покриття)
- Інтеграційні тести: 19 тестів (TasksRepository з реальною БД)
- E2E тести: 16 тестів (всі HTTP endpoints та сценарії)
- **Всього: 64 тести, всі проходять успішно**

## Автори

Проект розробляється в рамках виконання лабораторних робіт.
