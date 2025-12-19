const fastify = require('fastify')();
const tasksRoutes = require('../../src/routes/tasksRoutes');

// Мокируємо БД для інтеграційних тестів
jest.mock('../../src/database/dbConfig', () => {
  const Database = require('better-sqlite3');
  const path = require('path');
  const fs = require('fs');
  const dbPath = path.join(__dirname, '../../test-integration-tasks.db');
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

describe('Tasks API E2E Tests (via HTTP)', () => {
  let app;
  const db = require('../../src/database/dbConfig');

  beforeAll(async () => {
    app = fastify();
    await app.register(tasksRoutes, { prefix: '/tasks' });
    await app.ready();
  });

  beforeEach(() => {
    db.exec('DELETE FROM Tasks');
  });

  afterAll(async () => {
    try {
      if (app) {
        await app.close();
      }
    } catch (error) {
      // Ignore close errors
    }
    try {
      if (db) {
        db.close();
      }
    } catch (error) {
      // Ignore close errors
    }
    const path = require('path');
    const fs = require('fs');
    const dbPath = path.join(__dirname, '../../test-integration-tasks.db');
    if (fs.existsSync(dbPath)) {
      try {
        fs.unlinkSync(dbPath);
      } catch (error) {
        // Ignore delete errors
      }
    }
  });

  describe('GET /tasks', () => {
    it('should return empty array when no tasks', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/tasks',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toEqual([]);
      expect(body.count).toBe(0);
    });

    it('should return all tasks', async () => {
      // Додаємо тестові дані
      db.prepare(
        'INSERT INTO Tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(1, 'Test Task', 'Description', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      const response = await app.inject({
        method: 'GET',
        url: '/tasks',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].title).toBe('Test Task');
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return 404 when task not found', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/tasks/999',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Task not found');
    });

    it('should return task when found', async () => {
      const result = db
        .prepare(
          'INSERT INTO Tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
        .run(1, 'Test Task', 'Description', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      const response = await app.inject({
        method: 'GET',
        url: `/tasks/${result.lastInsertRowid}`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.title).toBe('Test Task');
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        userId: 1,
        title: 'New Task',
        description: 'New Description',
        status: 'pending',
        priority: 'high',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: taskData,
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.id).toBeDefined();
      expect(body.data.title).toBe('New Task');
    });

    it('should return 400 when validation fails', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          userId: 1,
          // title missing
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.errors).toBeDefined();
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update existing task', async () => {
      const result = db
        .prepare(
          'INSERT INTO Tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
        .run(1, 'Original', 'Desc', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      const response = await app.inject({
        method: 'PUT',
        url: `/tasks/${result.lastInsertRowid}`,
        payload: {
          status: 'completed',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.status).toBe('completed');
    });

    it('should return 404 when task not found', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/tasks/999',
        payload: {
          status: 'completed',
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete existing task', async () => {
      const result = db
        .prepare(
          'INSERT INTO Tasks (userId, title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
        .run(1, 'To Delete', 'Desc', 'pending', 'medium', new Date().toISOString(), new Date().toISOString());

      const response = await app.inject({
        method: 'DELETE',
        url: `/tasks/${result.lastInsertRowid}`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
    });

    it('should return 404 when task not found', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/tasks/999',
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
