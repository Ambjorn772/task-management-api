# ER-діаграма даних

## Модель даних

### Users (Користувачі)

```
┌─────────────────────────┐
│        Users            │
├─────────────────────────┤
│ id (PK)                 │
│ username (UNIQUE)       │
│ email (UNIQUE)          │
│ firstName               │
│ lastName                │
│ createdAt               │
│ updatedAt               │
└─────────────────────────┘
```

**Атрибути:**

- `id` - унікальний ідентифікатор (Primary Key)
- `username` - унікальне ім'я користувача
- `email` - унікальна електронна пошта
- `firstName` - ім'я
- `lastName` - прізвище
- `createdAt` - дата створення
- `updatedAt` - дата останнього оновлення

### Tasks (Завдання)

```
┌─────────────────────────┐
│        Tasks            │
├─────────────────────────┤
│ id (PK)                 │
│ userId (FK) ────────────┼───┐
│ title                   │   │
│ description             │   │
│ status                  │   │
│ priority                │   │
│ dueDate                 │   │
│ createdAt               │   │
│ updatedAt               │   │
└─────────────────────────┘   │
                              │
                              │
┌─────────────────────────┐   │
│        Users            │   │
├─────────────────────────┤   │
│ id (PK) ◄──────────────┼───┘
│ username               │
│ email                  │
│ ...                    │
└─────────────────────────┘
```

**Атрибути:**

- `id` - унікальний ідентифікатор (Primary Key)
- `userId` - зовнішній ключ до Users (Foreign Key)
- `title` - назва завдання
- `description` - опис завдання
- `status` - статус (pending, in-progress, completed, cancelled)
- `priority` - пріоритет (low, medium, high)
- `dueDate` - термін виконання
- `createdAt` - дата створення
- `updatedAt` - дата останнього оновлення

## Зв'язки між сутностями

### Users ↔ Tasks

**Тип зв'язку**: One-to-Many (один до багатьох)

- Один користувач може мати багато завдань
- Кожне завдання належить одному користувачу
- Зв'язок реалізований через Foreign Key `userId` в таблиці Tasks

**Діаграма зв'язку:**

```
Users (1) ────────< (Many) Tasks
```

## Повна ER-діаграма

```
┌─────────────────────────────────┐
│            Users                │
│  ┌───────────────────────────┐   │
│  │ id (PK)                  │   │
│  │ username (UNIQUE)        │   │
│  │ email (UNIQUE)           │   │
│  │ firstName                │   │
│  │ lastName                 │   │
│  │ createdAt                │   │
│  │ updatedAt                │   │
│  └───────────────────────────┘   │
└──────────────┬──────────────────┘
               │
               │ 1
               │
               │ has many
               │
               │ Many
               │
┌──────────────▼──────────────────┐
│            Tasks                │
│  ┌───────────────────────────┐   │
│  │ id (PK)                  │   │
│  │ userId (FK) ──────────────┼───┘
│  │ title                     │   │
│  │ description               │   │
│  │ status                    │   │
│  │ priority                  │   │
│  │ dueDate                   │   │
│  │ createdAt                 │   │
│  │ updatedAt                 │   │
│  └───────────────────────────┘   │
└──────────────────────────────────┘
```

## Типи даних

### Users

- `id`: Integer (Auto-increment)
- `username`: String (50 chars, UNIQUE, NOT NULL)
- `email`: String (100 chars, UNIQUE, NOT NULL)
- `firstName`: String (50 chars)
- `lastName`: String (50 chars)
- `createdAt`: DateTime (NOT NULL)
- `updatedAt`: DateTime (NOT NULL)

### Tasks

- `id`: Integer (Auto-increment)
- `userId`: Integer (Foreign Key → Users.id, NOT NULL)
- `title`: String (200 chars, NOT NULL)
- `description`: Text
- `status`: Enum ('pending', 'in-progress', 'completed', 'cancelled')
- `priority`: Enum ('low', 'medium', 'high')
- `dueDate`: DateTime
- `createdAt`: DateTime (NOT NULL)
- `updatedAt`: DateTime (NOT NULL)

## Обмеження (Constraints)

1. **Users:**
   - `username` - UNIQUE, NOT NULL
   - `email` - UNIQUE, NOT NULL, формат email

2. **Tasks:**
   - `userId` - FOREIGN KEY, NOT NULL, CASCADE DELETE (при видаленні користувача видаляються його завдання)
   - `title` - NOT NULL
   - `status` - значення з enum
   - `priority` - значення з enum
