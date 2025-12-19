const TasksRepository = require('../../src/repositories/TasksRepository');
const Task = require('../../src/models/Task');

// Мокируємо dbConfig для використання тестової БД
jest.mock('../../src/database/dbConfig', () => {
  const Database = require('better-sqlite3');
  const path = require('path');
  const fs = require('fs');
  const dbPath = path.join(__dirname, '../../test-tasks.db');
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE Tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'medium',
      dueDate TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  return db;
});

describe('TasksRepository', () => {
  let repository;
  const db = require('../../src/database/dbConfig');

  beforeEach(() => {
    // Очищаємо таблицю перед кожним тестом
    db.exec('DELETE FROM Tasks');
    repository = new TasksRepository();
  });

  afterAll(() => {
    db.close();
    const path = require('path');
    const fs = require('fs');
    const dbPath = path.join(__dirname, '../../test-tasks.db');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  describe('findAll', () => {
    it('should return empty array when no tasks exist', () => {
      const tasks = repository.findAll();
      expect(tasks).toEqual([]);
    });

    it('should return all tasks', () => {
      // Додаємо тестові дані
      db.prepare(
        'INSERT INTO Tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(1, 'Test Task', 'Description', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      const tasks = repository.findAll();
      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toBeInstanceOf(Task);
      expect(tasks[0].title).toBe('Test Task');
    });
  });

  describe('findById', () => {
    it('should return null when task does not exist', () => {
      const task = repository.findById(999);
      expect(task).toBeNull();
    });

    it('should return task when it exists', () => {
      const result = db
        .prepare(
          'INSERT INTO Tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
        .run(1, 'Test Task', 'Description', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      const task = repository.findById(result.lastInsertRowid);
      expect(task).toBeInstanceOf(Task);
      expect(task.title).toBe('Test Task');
      expect(task.id).toBe(result.lastInsertRowid);
    });
  });

  describe('findByUserId', () => {
    it('should return empty array when user has no tasks', () => {
      const tasks = repository.findByUserId(999);
      expect(tasks).toEqual([]);
    });

    it('should return tasks for specific user', () => {
      db.prepare(
        'INSERT INTO Tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(1, 'Task 1', 'Desc 1', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      db.prepare(
        'INSERT INTO Tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(2, 'Task 2', 'Desc 2', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      const tasks = repository.findByUserId(1);
      expect(tasks).toHaveLength(1);
      expect(tasks[0].userId).toBe(1);
      expect(tasks[0].title).toBe('Task 1');
    });
  });

  describe('create', () => {
    it('should create a new task', () => {
      const taskData = {
        userId: 1,
        title: 'New Task',
        description: 'New Description',
        status: 'pending',
        priority: 'high',
      };

      const task = repository.create(taskData);
      expect(task).toBeInstanceOf(Task);
      expect(task.id).toBeDefined();
      expect(task.title).toBe('New Task');
      expect(task.userId).toBe(1);
    });

    it('should set default values when not provided', () => {
      const taskData = {
        userId: 1,
        title: 'New Task',
      };

      const task = repository.create(taskData);
      expect(task.status).toBe('pending');
      expect(task.priority).toBe('medium');
    });
  });

  describe('update', () => {
    it('should return null when task does not exist', () => {
      const updated = repository.update(999, { title: 'Updated' });
      expect(updated).toBeNull();
    });

    it('should update existing task', () => {
      const result = db
        .prepare(
          'INSERT INTO Tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
        .run(1, 'Original', 'Desc', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      const task = repository.update(result.lastInsertRowid, { title: 'Updated Title', status: 'completed' });
      expect(task).toBeInstanceOf(Task);
      expect(task.title).toBe('Updated Title');
      expect(task.status).toBe('completed');
    });
  });

  describe('delete', () => {
    it('should return false when task does not exist', () => {
      const deleted = repository.delete(999);
      expect(deleted).toBe(false);
    });

    it('should delete existing task', () => {
      const result = db
        .prepare(
          'INSERT INTO Tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
        .run(1, 'To Delete', 'Desc', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      const deleted = repository.delete(result.lastInsertRowid);
      expect(deleted).toBe(true);

      const task = repository.findById(result.lastInsertRowid);
      expect(task).toBeNull();
    });
  });
});
