# Використання API

## Запуск сервісів

### 1. Запуск Tasks Service

```bash
npm run start:tasks
```

Сервіс буде доступний на `http://localhost:3001`

### 2. Запуск Users Service

```bash
npm run start:users
```

Сервіс буде доступний на `http://localhost:3002`

**Важливо:** Запускайте Tasks Service перед Users Service, оскільки Users Service інтегрується з Tasks Service.

## Приклади використання

### Tasks Service

#### Отримати всі завдання
```bash
curl http://localhost:3001/tasks
```

#### Отримати завдання за ID
```bash
curl http://localhost:3001/tasks/1
```

#### Отримати завдання користувача
```bash
curl http://localhost:3001/tasks/user/1
```

#### Створити нове завдання
```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "title": "Нове завдання",
    "description": "Опис завдання",
    "status": "pending",
    "priority": "medium"
  }'
```

#### Оновити завдання
```bash
curl -X PUT http://localhost:3001/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

#### Видалити завдання
```bash
curl -X DELETE http://localhost:3001/tasks/1
```

### Users Service

#### Отримати всіх користувачів
```bash
curl http://localhost:3002/users
```

#### Отримати користувача за ID
```bash
curl http://localhost:3002/users/1
```

#### Отримати завдання користувача (з інтеграцією)
```bash
curl http://localhost:3002/users/1/tasks
```

#### Створити нового користувача
```bash
curl -X POST http://localhost:3002/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_user",
    "email": "new.user@example.com",
    "firstName": "New",
    "lastName": "User"
  }'
```

#### Оновити користувача
```bash
curl -X PUT http://localhost:3002/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'
```

#### Видалити користувача
```bash
curl -X DELETE http://localhost:3002/users/1
```

## Health Check

### Tasks Service
```bash
curl http://localhost:3001/health
```

### Users Service
```bash
curl http://localhost:3002/health
```

## Статуси відповідей

- `200` - Успішний запит
- `201` - Ресурс створено
- `400` - Помилка валідації
- `404` - Ресурс не знайдено
- `409` - Конфлікт (наприклад, username або email вже існує)
- `500` - Внутрішня помилка сервера
- `503` - Сервіс недоступний (для інтеграції між сервісами)

## Формат відповіді

Всі відповіді мають наступний формат:

**Успішна відповідь:**
```json
{
  "success": true,
  "data": {...}
}
```

**Помилка:**
```json
{
  "success": false,
  "error": "Error message",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

