# Tasks Service

Сервіс для управління завданнями.

## Запуск

```bash
# З кореня проекту
npm run start:tasks

# Або напряму
node services/tasks-service/src/server.js
```

Сервіс буде доступний на `http://localhost:3001`

## API Endpoints

### GET /tasks
Отримати всі завдання

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 4
}
```

### GET /tasks/:id
Отримати завдання за ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "title": "...",
    "status": "in-progress",
    ...
  }
}
```

### GET /tasks/user/:userId
Отримати завдання користувача

### POST /tasks
Створити нове завдання

**Request Body:**
```json
{
  "userId": 1,
  "title": "Нове завдання",
  "description": "Опис завдання",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2025-12-25T00:00:00.000Z"
}
```

### PUT /tasks/:id
Оновити завдання

### DELETE /tasks/:id
Видалити завдання

### GET /health
Health check endpoint

## Статичні дані

Сервіс використовує in-memory storage з попередньо заповненими даними для тестування.

