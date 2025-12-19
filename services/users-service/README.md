# Users Service

Сервіс для управління користувачами з інтеграцією з Tasks Service.

## Запуск

```bash
# З кореня проекту
npm run start:users

# Або напряму
node services/users-service/src/server.js
```

Сервіс буде доступний на `http://localhost:3002`

**Важливо:** Перед запуском Users Service, необхідно запустити Tasks Service на порту 3001.

## API Endpoints

### GET /users
Отримати всіх користувачів

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 3
}
```

### GET /users/:id
Отримати користувача за ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john.doe@example.com",
    ...
  }
}
```

### GET /users/:id/tasks
Отримати завдання користувача (інтеграція з Tasks Service)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "stats": {
    "total": 2,
    "byStatus": {
      "pending": 1,
      "in-progress": 1,
      "completed": 0,
      "cancelled": 0
    },
    "byPriority": {
      "high": 1,
      "medium": 1,
      "low": 0
    }
  }
}
```

### POST /users
Створити нового користувача

**Request Body:**
```json
{
  "username": "new_user",
  "email": "new.user@example.com",
  "firstName": "New",
  "lastName": "User"
}
```

### PUT /users/:id
Оновити користувача

### DELETE /users/:id
Видалити користувача

### GET /health
Health check endpoint

## Статичні дані

Сервіс використовує in-memory storage з попередньо заповненими даними для тестування.

## Інтеграція з Tasks Service

Users Service інтегрується з Tasks Service через HTTP клієнт для отримання завдань користувача.

