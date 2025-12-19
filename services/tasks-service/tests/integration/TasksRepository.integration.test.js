const TasksRepository = require('../../src/repositories/TasksRepository');
const Task = require('../../src/models/Task');

// Мокируємо dbConfig для інтеграційних тестів
jest.mock('../../src/database/dbConfig', () => {
  const Database = require('better-sqlite3');
  const path = require('path');
  const fs = require('fs');
  const dbPath = path.join(__dirname, '../../test-integration-repo-tasks.db');
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

describe('TasksRepository Integration Tests', () => {
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
    const dbPath = path.join(__dirname, '../../test-integration-repo-tasks.db');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  describe('Database Connection and Initialization', () => {
    it('should connect to test database successfully', () => {
      expect(db).toBeDefined();
      const result = db.prepare('SELECT 1 as test').get();
      expect(result.test).toBe(1);
    });

    it('should have Tasks table with correct structure', () => {
      const tableInfo = db.prepare("PRAGMA table_info(Tasks)").all();
      const columnNames = tableInfo.map(col => col.name);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('userId');
      expect(columnNames).toContain('title');
      expect(columnNames).toContain('status');
      expect(columnNames).toContain('priority');
    });
  });

  describe('create', () => {
    it('should create a new task in database', () => {
      const taskData = {
        userId: 1,
        title: 'Integration Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'high',
      };

      const task = repository.create(taskData);
      
      expect(task).toBeInstanceOf(Task);
      expect(task.id).toBeDefined();
      expect(task.title).toBe('Integration Test Task');
      expect(task.userId).toBe(1);
      
      // Verify in database
      const dbTask = db.prepare('SELECT * FROM Tasks WHERE id = ?').get(task.id);
      expect(dbTask).toBeDefined();
      expect(dbTask.title).toBe('Integration Test Task');
    });

    it('should set default values when not provided', () => {
      const taskData = {
        userId: 1,
        title: 'Task with defaults',
      };

      const task = repository.create(taskData);
      expect(task.status).toBe('pending');
      expect(task.priority).toBe('medium');
    });

    it('should set createdAt and updatedAt timestamps', () => {
      const taskData = {
        userId: 1,
        title: 'Timestamp Test',
      };

      const task = repository.create(taskData);
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
      expect(new Date(task.createdAt).getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('findById', () => {
    it('should return null when task does not exist', () => {
      const task = repository.findById(999);
      expect(task).toBeNull();
    });

    it('should return task when it exists in database', () => {
      // Insert directly into DB
      const result = db
        .prepare(
          'INSERT INTO Tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
        .run(1, 'DB Task', 'Description', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      const task = repository.findById(result.lastInsertRowid);
      expect(task).toBeInstanceOf(Task);
      expect(task.title).toBe('DB Task');
      expect(task.id).toBe(result.lastInsertRowid);
    });
  });

  describe('findAll', () => {
    it('should return empty array when no tasks exist', () => {
      const tasks = repository.findAll();
      expect(tasks).toEqual([]);
    });

    it('should return all tasks from database', () => {
      // Insert multiple tasks
      db.prepare(
        'INSERT INTO Tasks (userId, title, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(1, 'Task 1', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());
      
      db.prepare(
        'INSERT INTO Tasks (userId, title, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(2, 'Task 2', 'completed', 'high', new Date().toISOString(), new Date().toISOString());

      const tasks = repository.findAll();
      expect(tasks).toHaveLength(2);
      expect(tasks[0]).toBeInstanceOf(Task);
    });

    it('should return tasks ordered by createdAt DESC', () => {
      const now = new Date();
      const earlier = new Date(now.getTime() - 1000).toISOString();
      const later = now.toISOString();

      db.prepare(
        'INSERT INTO Tasks (userId, title, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(1, 'Earlier Task', 'pending', 'medium', earlier, earlier);
      
      db.prepare(
        'INSERT INTO Tasks (userId, title, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(1, 'Later Task', 'pending', 'medium', later, later);

      const tasks = repository.findAll();
      expect(tasks[0].title).toBe('Later Task');
      expect(tasks[1].title).toBe('Earlier Task');
    });
  });

  describe('findByUserId', () => {
    it('should return empty array when user has no tasks', () => {
      const tasks = repository.findByUserId(999);
      expect(tasks).toEqual([]);
    });

    it('should return only tasks for specific user', () => {
      // Insert tasks for different users
      db.prepare(
        'INSERT INTO Tasks (userId, title, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(1, 'User 1 Task', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());
      
      db.prepare(
        'INSERT INTO Tasks (userId, title, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(2, 'User 2 Task', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());
      
      db.prepare(
        'INSERT INTO Tasks (userId, title, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(1, 'User 1 Task 2', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      const user1Tasks = repository.findByUserId(1);
      expect(user1Tasks).toHaveLength(2);
      expect(user1Tasks.every(task => task.userId === 1)).toBe(true);
    });
  });

  describe('update', () => {
    it('should return null when task does not exist', () => {
      const updated = repository.update(999, { title: 'Updated' });
      expect(updated).toBeNull();
    });

    it('should update existing task in database', () => {
      const result = db
        .prepare(
          'INSERT INTO Tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
        .run(1, 'Original', 'Desc', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      const task = repository.update(result.lastInsertRowid, { 
        title: 'Updated Title', 
        status: 'completed' 
      });
      
      expect(task).toBeInstanceOf(Task);
      expect(task.title).toBe('Updated Title');
      expect(task.status).toBe('completed');
      
      // Verify in database
      const dbTask = db.prepare('SELECT * FROM Tasks WHERE id = ?').get(result.lastInsertRowid);
      expect(dbTask.title).toBe('Updated Title');
      expect(dbTask.status).toBe('completed');
    });

    it('should update updatedAt timestamp', () => {
      const now = new Date();
      const createdAt = new Date(now.getTime() - 5000).toISOString();
      
      const result = db
        .prepare(
          'INSERT INTO Tasks (userId, title, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
        )
        .run(1, 'Original', 'pending', 'medium', createdAt, createdAt);

      const task = repository.update(result.lastInsertRowid, { status: 'completed' });
      expect(new Date(task.updatedAt).getTime()).toBeGreaterThan(new Date(createdAt).getTime());
    });

    it('should update only provided fields', () => {
      const result = db
        .prepare(
          'INSERT INTO Tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
        .run(1, 'Original', 'Original Desc', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      const task = repository.update(result.lastInsertRowid, { status: 'completed' });
      expect(task.title).toBe('Original');
      expect(task.description).toBe('Original Desc');
      expect(task.status).toBe('completed');
    });
  });

  describe('delete', () => {
    it('should return false when task does not exist', () => {
      const deleted = repository.delete(999);
      expect(deleted).toBe(false);
    });

    it('should delete existing task from database', () => {
      const result = db
        .prepare(
          'INSERT INTO Tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
        .run(1, 'To Delete', 'Desc', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      const taskId = result.lastInsertRowid;
      const deleted = repository.delete(taskId);
      expect(deleted).toBe(true);

      // Verify deleted from database
      const dbTask = db.prepare('SELECT * FROM Tasks WHERE id = ?').get(taskId);
      expect(dbTask).toBeUndefined();
    });
  });

  describe('mapRowToTask', () => {
    it('should correctly map database row to Task model', () => {
      const result = db
        .prepare(
          'INSERT INTO Tasks (userId, title, description, status, priority, dueDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        )
        .run(
          1, 
          'Mapped Task', 
          'Description', 
          'in-progress', 
          'high', 
          '2025-12-31T00:00:00.000Z',
          new Date().toISOString(), 
          new Date().toISOString()
        );

      const task = repository.findById(result.lastInsertRowid);
      expect(task).toBeInstanceOf(Task);
      expect(task.id).toBe(result.lastInsertRowid);
      expect(task.userId).toBe(1);
      expect(task.title).toBe('Mapped Task');
      expect(task.description).toBe('Description');
      expect(task.status).toBe('in-progress');
      expect(task.priority).toBe('high');
      expect(task.dueDate).toBe('2025-12-31T00:00:00.000Z');
    });
  });
});


