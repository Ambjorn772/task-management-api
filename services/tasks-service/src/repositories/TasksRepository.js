const Task = require('../models/Task');

class TasksRepository {
  constructor() {
    // Статичні дані (in-memory storage)
    this.tasks = [
      new Task({
        id: 1,
        userId: 1,
        title: 'Завершити лабораторну роботу №3',
        description: 'Імплементувати прототип зі статичними даними',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2025-12-20T00:00:00.000Z',
        createdAt: '2025-12-18T10:00:00.000Z',
        updatedAt: '2025-12-19T08:00:00.000Z',
      }),
      new Task({
        id: 2,
        userId: 1,
        title: 'Написати тести для API',
        description: 'Створити unit тести для всіх endpoints',
        status: 'pending',
        priority: 'medium',
        dueDate: '2025-12-25T00:00:00.000Z',
        createdAt: '2025-12-18T11:00:00.000Z',
        updatedAt: '2025-12-18T11:00:00.000Z',
      }),
      new Task({
        id: 3,
        userId: 2,
        title: 'Оновити документацію',
        description: 'Додати опис нових endpoints',
        status: 'completed',
        priority: 'low',
        dueDate: '2025-12-15T00:00:00.000Z',
        createdAt: '2025-12-10T09:00:00.000Z',
        updatedAt: '2025-12-15T14:00:00.000Z',
      }),
      new Task({
        id: 4,
        userId: 2,
        title: 'Налаштувати CI/CD',
        description: 'Налаштувати GitHub Actions',
        status: 'pending',
        priority: 'high',
        dueDate: '2025-12-30T00:00:00.000Z',
        createdAt: '2025-12-19T12:00:00.000Z',
        updatedAt: '2025-12-19T12:00:00.000Z',
      }),
    ];
    this.nextId = 5;
  }

  findAll() {
    return this.tasks;
  }

  findById(id) {
    return this.tasks.find((task) => task.id === parseInt(id, 10));
  }

  findByUserId(userId) {
    return this.tasks.filter((task) => task.userId === parseInt(userId, 10));
  }

  create(taskData) {
    const task = new Task({
      ...taskData,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    this.tasks.push(task);
    return task;
  }

  update(id, taskData) {
    const task = this.findById(id);
    if (!task) {
      return null;
    }

    Object.assign(task, {
      ...taskData,
      id: task.id, // Не дозволяємо змінювати id
      updatedAt: new Date().toISOString(),
    });

    return task;
  }

  delete(id) {
    const index = this.tasks.findIndex((task) => task.id === parseInt(id, 10));
    if (index === -1) {
      return false;
    }
    this.tasks.splice(index, 1);
    return true;
  }
}

module.exports = TasksRepository;
