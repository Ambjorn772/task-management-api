# Архітектура системи

## Огляд системи

Task Management API - це мікросервісна архітектура, що складається з двох незалежних сервісів:

- **Tasks Service** - управління завданнями
- **Users Service** - управління користувачами

## Компоненти системи

### Tasks Service

**Основні компоненти:**

- **API Router** - обробка HTTP запитів
- **Tasks Controller** - логіка обробки запитів
- **Tasks Repository** - робота з даними завдань
- **Tasks Model** - модель даних завдання
- **Validation Service** - валідація вхідних даних

**Endpoints:**

- `GET /tasks` - отримати всі завдання
- `GET /tasks/:id` - отримати завдання за ID
- `POST /tasks` - створити нове завдання
- `PUT /tasks/:id` - оновити завдання
- `DELETE /tasks/:id` - видалити завдання
- `GET /tasks/user/:userId` - отримати завдання користувача

### Users Service

**Основні компоненти:**

- **API Router** - обробка HTTP запитів
- **Users Controller** - логіка обробки запитів
- **Users Repository** - робота з даними користувачів
- **Users Model** - модель даних користувача
- **Validation Service** - валідація вхідних даних
- **Tasks Integration Client** - клієнт для інтеграції з Tasks Service

**Endpoints:**

- `GET /users` - отримати всіх користувачів
- `GET /users/:id` - отримати користувача за ID
- `POST /users` - створити нового користувача
- `PUT /users/:id` - оновити користувача
- `DELETE /users/:id` - видалити користувача
- `GET /users/:id/tasks` - отримати завдання користувача (інтеграція з Tasks Service)

## Взаємодія компонентів

### Внутрішня архітектура сервісу

```
HTTP Request
    ↓
API Router
    ↓
Controller (бізнес-логіка)
    ↓
Repository (доступ до даних)
    ↓
Model (структура даних)
    ↓
Response
```

### Міжсервісна інтеграція

```
Users Service                    Tasks Service
     │                                │
     │  GET /users/:id/tasks          │
     │  ────────────────────────────>│
     │                                │
     │  GET /tasks/user/:userId       │
     │  <──────────────────────────── │
     │                                │
     │  Response: tasks[]             │
     │  <──────────────────────────── │
     │                                │
```

## Технологічний стек

- **Runtime**: Node.js
- **Framework**: Express.js
- **Data Storage**: (поки статичні дані, пізніше БД)
- **Communication**: HTTP REST API
- **Validation**: вбудована валідація + можливо Joi або express-validator

## Принципи архітектури

1. **Розділення відповідальності** - кожен сервіс відповідає за свою область
2. **Незалежність сервісів** - сервіси можуть працювати окремо
3. **RESTful API** - стандартний HTTP протокол для комунікації
4. **Модульність** - код розділений на логічні модулі
