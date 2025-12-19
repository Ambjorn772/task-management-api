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
- **Express.js** - веб-фреймворк для створення API
- **TypeScript** (опціонально) - для типізації
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
│   │   ├── tests/
│   │   └── package.json
│   └── users-service/
│       ├── src/
│       ├── tests/
│       └── package.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── COMPONENT_DIAGRAM.md
│   ├── ER_DIAGRAM.md
│   ├── DATA_SCENARIOS.md
│   └── DIAGRAMS.md
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
- In-memory storage зі статичними даними
- Валідація даних
- Інтеграція між сервісами (Users Service → Tasks Service)
- Агрегація статистики для завдань користувача

**Документація:**
- [API Usage Guide](API_USAGE.md)

### Лабораторна робота № 4
- [ ] Інтеграція з базою даних
- [ ] Заміна статичних даних на реальну роботу з БД

### Лабораторна робота № 5
- [ ] Unit-тести для модулів
- [ ] Інтеграційні тести
- [ ] E2E тести
- [ ] Мутаційне тестування та репорт

### Лабораторна робота № 6
- [ ] Налаштування CI (GitHub Actions)
- [ ] Налаштування CD (автоматичне розгортання)
- [ ] Розгортання на Stage-сервері

## Запуск проекту

```bash
# Встановлення залежностей
npm install

# Запуск Tasks Service
cd services/tasks-service
npm start

# Запуск Users Service
cd services/users-service
npm start
```

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
```

## Автори

Проект розробляється в рамках виконання лабораторних робіт.
