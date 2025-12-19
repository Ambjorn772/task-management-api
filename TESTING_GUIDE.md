# Руководство по тестированию API

## Запуск сервисов

### Вариант 1: Два отдельных терминала

**Терминал 1 - Tasks Service:**
```bash
cd C:\Users\Admin\source\repos\nodejs-project
npm run start:tasks
```

Вы должны увидеть:
```
Tasks Service is running on http://localhost:3001
Health check: http://localhost:3001/health
```

**Терминал 2 - Users Service:**
```bash
cd C:\Users\Admin\source\repos\nodejs-project
npm run start:users
```

Вы должны увидеть:
```
Users Service is running on http://localhost:3002
Health check: http://localhost:3002/health
```

### Важливо:
- **Сначала запустите Tasks Service**, затем Users Service
- Оба сервиса должны работать одновременно
- Не закрывайте терминалы, пока тестируете

## Тестирование через браузер

### Health Check (проверка работоспособности)

1. **Tasks Service:**
   - Откройте в браузере: http://localhost:3001/health
   - Должны увидеть: `{"success":true,"service":"Tasks Service","status":"running",...}`

2. **Users Service:**
   - Откройте в браузере: http://localhost:3002/health
   - Должны увидеть: `{"success":true,"service":"Users Service","status":"running",...}`

### GET запросы (можно тестировать в браузере)

**Tasks Service:**
- Все задачи: http://localhost:3001/tasks
- Задача по ID: http://localhost:3001/tasks/1
- Задачи пользователя: http://localhost:3001/tasks/user/1

**Users Service:**
- Все пользователи: http://localhost:3002/users
- Пользователь по ID: http://localhost:3002/users/1
- Задачи пользователя: http://localhost:3002/users/1/tasks

## Тестирование через PowerShell (curl)

### Tasks Service

#### 1. Получить все задачи
```powershell
curl http://localhost:3001/tasks
```

#### 2. Получить задачу по ID
```powershell
curl http://localhost:3001/tasks/1
```

#### 3. Получить задачи пользователя
```powershell
curl http://localhost:3001/tasks/user/1
```

#### 4. Создать новую задачу
```powershell
curl -Method POST -Uri http://localhost:3001/tasks -ContentType "application/json" -Body '{"userId":1,"title":"Новая задача","description":"Описание","status":"pending","priority":"high"}'
```

#### 5. Обновить задачу
```powershell
curl -Method PUT -Uri http://localhost:3001/tasks/1 -ContentType "application/json" -Body '{"status":"completed"}'
```

#### 6. Удалить задачу
```powershell
curl -Method DELETE -Uri http://localhost:3001/tasks/1
```

### Users Service

#### 1. Получить всех пользователей
```powershell
curl http://localhost:3002/users
```

#### 2. Получить пользователя по ID
```powershell
curl http://localhost:3002/users/1
```

#### 3. Получить задачи пользователя (с интеграцией)
```powershell
curl http://localhost:3002/users/1/tasks
```

#### 4. Создать нового пользователя
```powershell
curl -Method POST -Uri http://localhost:3002/users -ContentType "application/json" -Body '{"username":"test_user","email":"test@example.com","firstName":"Test","lastName":"User"}'
```

#### 5. Обновить пользователя
```powershell
curl -Method PUT -Uri http://localhost:3002/users/1 -ContentType "application/json" -Body '{"firstName":"Updated","lastName":"Name"}'
```

#### 6. Удалить пользователя
```powershell
curl -Method DELETE -Uri http://localhost:3002/users/1
```

## Тестирование через Postman

### Настройка

1. Создайте новую коллекцию "Task Management API"
2. Добавьте две папки: "Tasks Service" и "Users Service"

### Tasks Service - Примеры запросов

**GET /tasks**
- Method: GET
- URL: http://localhost:3001/tasks

**GET /tasks/:id**
- Method: GET
- URL: http://localhost:3001/tasks/1

**GET /tasks/user/:userId**
- Method: GET
- URL: http://localhost:3001/tasks/user/1

**POST /tasks**
- Method: POST
- URL: http://localhost:3001/tasks
- Headers: Content-Type: application/json
- Body (raw JSON):
```json
{
  "userId": 1,
  "title": "Новая задача",
  "description": "Описание задачи",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2025-12-25T00:00:00.000Z"
}
```

**PUT /tasks/:id**
- Method: PUT
- URL: http://localhost:3001/tasks/1
- Headers: Content-Type: application/json
- Body (raw JSON):
```json
{
  "status": "completed"
}
```

**DELETE /tasks/:id**
- Method: DELETE
- URL: http://localhost:3001/tasks/1

### Users Service - Примеры запросов

**GET /users**
- Method: GET
- URL: http://localhost:3002/users

**GET /users/:id**
- Method: GET
- URL: http://localhost:3002/users/1

**GET /users/:id/tasks** (с интеграцией!)
- Method: GET
- URL: http://localhost:3002/users/1/tasks
- **Важно:** Tasks Service должен быть запущен!

**POST /users**
- Method: POST
- URL: http://localhost:3002/users
- Headers: Content-Type: application/json
- Body (raw JSON):
```json
{
  "username": "new_user",
  "email": "new.user@example.com",
  "firstName": "New",
  "lastName": "User"
}
```

**PUT /users/:id**
- Method: PUT
- URL: http://localhost:3002/users/1
- Headers: Content-Type: application/json
- Body (raw JSON):
```json
{
  "firstName": "Updated",
  "lastName": "Name"
}
```

**DELETE /users/:id**
- Method: DELETE
- URL: http://localhost:3002/users/1

## Последовательность тестирования

### 1. Проверка работоспособности
```powershell
# Tasks Service
curl http://localhost:3001/health

# Users Service
curl http://localhost:3002/health
```

### 2. Тестирование Tasks Service

```powershell
# Получить все задачи
curl http://localhost:3001/tasks

# Получить задачу по ID
curl http://localhost:3001/tasks/1

# Создать новую задачу
curl -Method POST -Uri http://localhost:3001/tasks -ContentType "application/json" -Body '{"userId":1,"title":"Тестовая задача","description":"Описание","status":"pending","priority":"high"}'

# Обновить задачу
curl -Method PUT -Uri http://localhost:3001/tasks/1 -ContentType "application/json" -Body '{"status":"in-progress"}'

# Получить задачи пользователя
curl http://localhost:3001/tasks/user/1
```

### 3. Тестирование Users Service

```powershell
# Получить всех пользователей
curl http://localhost:3002/users

# Получить пользователя по ID
curl http://localhost:3002/users/1

# Создать нового пользователя
curl -Method POST -Uri http://localhost:3002/users -ContentType "application/json" -Body '{"username":"test_user","email":"test@example.com","firstName":"Test","lastName":"User"}'

# Получить задачи пользователя (интеграция!)
curl http://localhost:3002/users/1/tasks
```

### 4. Тестирование интеграции

**Важно:** Оба сервиса должны быть запущены!

```powershell
# 1. Создать пользователя
curl -Method POST -Uri http://localhost:3002/users -ContentType "application/json" -Body '{"username":"integration_test","email":"integration@test.com","firstName":"Integration","lastName":"Test"}'

# 2. Создать задачу для этого пользователя
curl -Method POST -Uri http://localhost:3001/tasks -ContentType "application/json" -Body '{"userId":1,"title":"Задача для интеграции","description":"Тест интеграции","status":"pending","priority":"medium"}'

# 3. Получить задачи пользователя через Users Service (интеграция!)
curl http://localhost:3002/users/1/tasks
```

## Ожидаемые результаты

### Успешные ответы (200/201)
```json
{
  "success": true,
  "data": {...}
}
```

### Ошибки валидации (400)
```json
{
  "success": false,
  "errors": ["Error message 1", "Error message 2"]
}
```

### Ресурс не найден (404)
```json
{
  "success": false,
  "error": "Task not found"
}
```

### Конфликт (409) - для Users Service
```json
{
  "success": false,
  "error": "Username already exists"
}
```

## Отладка

### Проблема: "Cannot GET /tasks"
- Проверьте, что Tasks Service запущен на порту 3001
- Проверьте URL: должен быть `http://localhost:3001/tasks`

### Проблема: "Tasks Service is unavailable" (503)
- Убедитесь, что Tasks Service запущен
- Проверьте, что он работает на порту 3001
- Проверьте health check: http://localhost:3001/health

### Проблема: Порт уже занят
- Закройте другие приложения, использующие порты 3001 или 3002
- Или измените порты в файлах `server.js` каждого сервиса

## Быстрый старт

1. Откройте **два терминала**
2. В первом терминале:
   ```bash
   cd C:\Users\Admin\source\repos\nodejs-project
   npm run start:tasks
   ```
3. Во втором терминале:
   ```bash
   cd C:\Users\Admin\source\repos\nodejs-project
   npm run start:users
   ```
4. Откройте браузер и перейдите на:
   - http://localhost:3001/tasks
   - http://localhost:3002/users
5. Начните тестирование!

