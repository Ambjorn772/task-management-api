# Візуальні діаграми системи

## Діаграма компонентів - Tasks Service

```mermaid
graph TB
    A[HTTP Request] --> B[API Router<br/>Express]
    B --> C[Controller]
    C --> D[Validation Service]
    D --> E[Repository]
    E --> F[Tasks Model]
    F --> G[Response]

    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1f5
    style D fill:#e1ffe1
    style E fill:#f5e1ff
    style F fill:#ffe1e1
    style G fill:#e1f5ff
```

## Діаграма компонентів - Users Service

```mermaid
graph TB
    A[HTTP Request] --> B[API Router<br/>Express]
    B --> C[Controller]
    C --> D[Validation Service]
    D --> E[Repository]
    E --> F[Users Model]
    C --> G[Tasks Integration Client]
    G --> H[Tasks Service<br/>HTTP API]
    H --> I[Tasks Data]
    I --> G
    G --> C
    F --> J[Response]

    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1f5
    style D fill:#e1ffe1
    style E fill:#f5e1ff
    style F fill:#ffe1e1
    style G fill:#ffffe1
    style H fill:#e1ffff
    style J fill:#e1f5ff
```

## Системна діаграма взаємодії сервісів

```mermaid
graph LR
    subgraph "Users Service"
        UR[API Router]
        UC[Controller]
        UR1[Repository]
        UM[Users Model]
        TC[Tasks Client]
    end

    subgraph "Tasks Service"
        TR[API Router]
        TC1[Controller]
        TR1[Repository]
        TM[Tasks Model]
    end

    Client[Client] --> UR
    UR --> UC
    UC --> UR1
    UR1 --> UM

    UC --> TC
    TC -->|HTTP GET /tasks/user/:userId| TR
    TR --> TC1
    TC1 --> TR1
    TR1 --> TM
    TM --> TC1
    TC1 --> TR
    TR --> TC
    TC --> UC
    UC --> Client

    style Client fill:#e1f5ff
    style UR fill:#fff4e1
    style UC fill:#ffe1f5
    style TC fill:#ffffe1
    style TR fill:#fff4e1
    style TC1 fill:#ffe1f5
```

## ER-діаграма

```mermaid
erDiagram
    USERS ||--o{ TASKS : "has many"

    USERS {
        int id PK
        string username UK
        string email UK
        string firstName
        string lastName
        datetime createdAt
        datetime updatedAt
    }

    TASKS {
        int id PK
        int userId FK
        string title
        text description
        enum status
        enum priority
        datetime dueDate
        datetime createdAt
        datetime updatedAt
    }
```

## Діаграма послідовності - Створення завдання

```mermaid
sequenceDiagram
    participant Client
    participant TasksAPI as Tasks Service API
    participant Controller
    participant Validation
    participant Repository
    participant Model

    Client->>TasksAPI: POST /tasks
    TasksAPI->>Controller: Route request
    Controller->>Validation: Validate data
    Validation-->>Controller: Validation OK
    Controller->>Repository: Create task
    Repository->>Model: Save task
    Model-->>Repository: Task saved
    Repository-->>Controller: Task created
    Controller-->>TasksAPI: Response
    TasksAPI-->>Client: 201 Created
```

## Діаграма послідовності - Отримання завдань користувача

```mermaid
sequenceDiagram
    participant Client
    participant UsersAPI as Users Service API
    participant UsersController
    participant TasksClient as Tasks Client
    participant TasksAPI as Tasks Service API
    participant TasksController
    participant Repository

    Client->>UsersAPI: GET /users/:id/tasks
    UsersAPI->>UsersController: Route request
    UsersController->>TasksClient: GET /tasks/user/:userId
    TasksClient->>TasksAPI: HTTP Request
    TasksAPI->>TasksController: Route request
    TasksController->>Repository: Get tasks by userId
    Repository-->>TasksController: Tasks array
    TasksController-->>TasksAPI: Response
    TasksAPI-->>TasksClient: Tasks data
    TasksClient-->>UsersController: Tasks array
    UsersController-->>UsersAPI: Response with tasks
    UsersAPI-->>Client: 200 OK + Tasks
```

## Діаграма станів - Завдання

```mermaid
stateDiagram-v2
    [*] --> pending: Create task
    pending --> in_progress: Start work
    in_progress --> completed: Finish
    in_progress --> pending: Revert
    pending --> cancelled: Cancel
    in_progress --> cancelled: Cancel
    completed --> [*]
    cancelled --> [*]
```

## Діаграма класів (UML-подібна)

```mermaid
classDiagram
    class TasksController {
        +createTask(data)
        +getTask(id)
        +updateTask(id, data)
        +deleteTask(id)
        +getTasksByUserId(userId)
    }

    class TasksRepository {
        +create(task)
        +findById(id)
        +update(id, data)
        +delete(id)
        +findByUserId(userId)
    }

    class TaskModel {
        +id: int
        +userId: int
        +title: string
        +description: string
        +status: enum
        +priority: enum
        +dueDate: datetime
        +createdAt: datetime
        +updatedAt: datetime
    }

    class UsersController {
        +createUser(data)
        +getUser(id)
        +updateUser(id, data)
        +deleteUser(id)
        +getUserTasks(userId)
    }

    class UsersRepository {
        +create(user)
        +findById(id)
        +update(id, data)
        +delete(id)
    }

    class UserModel {
        +id: int
        +username: string
        +email: string
        +firstName: string
        +lastName: string
        +createdAt: datetime
        +updatedAt: datetime
    }

    class TasksClient {
        +getTasksByUserId(userId)
    }

    TasksController --> TasksRepository
    TasksRepository --> TaskModel
    UsersController --> UsersRepository
    UsersController --> TasksClient
    UsersRepository --> UserModel
    TasksClient --> TasksController
```
