const fastify = require('fastify')();
const tasksRoutes = require('../../src/routes/tasksRoutes');

// Мокируємо БД для E2E тестів
jest.mock('../../src/database/dbConfig', () => {
  const Database = require('better-sqlite3');
  const path = require('path');
  const fs = require('fs');
  const dbPath = path.join(__dirname, '../../test-e2e-tasks.db');
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

describe('Tasks Service E2E Tests', () => {
  let app;
  const db = require('../../src/database/dbConfig');

  beforeAll(async () => {
    app = fastify({ logger: false });
    await app.register(tasksRoutes, { prefix: '/tasks' });
    await app.ready();
  });

  beforeEach(() => {
    db.exec('DELETE FROM Tasks');
  });

  afterAll(async () => {
    await app.close();
    db.close();
    const path = require('path');
    const fs = require('fs');
    const dbPath = path.join(__dirname, '../../test-e2e-tasks.db');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  describe('Full Task Lifecycle', () => {
    it('should create, read, update and delete a task', async () => {
      // Create
      const createResponse = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          userId: 1,
          title: 'E2E Test Task',
          description: 'E2E Description',
          status: 'pending',
          priority: 'high',
        },
      });

      expect(createResponse.statusCode).toBe(201);
      const createBody = JSON.parse(createResponse.body);
      expect(createBody.success).toBe(true);
      const taskId = createBody.data.id;

      // Read
      const getResponse = await app.inject({
        method: 'GET',
        url: `/tasks/${taskId}`,
      });

      expect(getResponse.statusCode).toBe(200);
      const getBody = JSON.parse(getResponse.body);
      expect(getBody.data.title).toBe('E2E Test Task');

      // Update
      const updateResponse = await app.inject({
        method: 'PUT',
        url: `/tasks/${taskId}`,
        payload: {
          status: 'completed',
        },
      });

      expect(updateResponse.statusCode).toBe(200);
      const updateBody = JSON.parse(updateResponse.body);
      expect(updateBody.data.status).toBe('completed');

      // Delete
      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: `/tasks/${taskId}`,
      });

      expect(deleteResponse.statusCode).toBe(200);

      // Verify deleted
      const verifyResponse = await app.inject({
        method: 'GET',
        url: `/tasks/${taskId}`,
      });

      expect(verifyResponse.statusCode).toBe(404);
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.service).toBe('Tasks Service');
    });
  });

  describe('Get Tasks by User ID', () => {
    it('should return tasks for specific user', async () => {
      // Create tasks for different users
      await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          userId: 1,
          title: 'User 1 Task',
          status: 'pending',
        },
      });

      await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          userId: 2,
          title: 'User 2 Task',
          status: 'pending',
        },
      });

      const response = await app.inject({
        method: 'GET',
        url: '/tasks/user/1',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].userId).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid task ID', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/tasks/invalid',
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.errors).toBeDefined();
    });

    it('should handle missing required fields on create', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          // userId and title missing
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.errors).toBeDefined();
    });

    it('should handle invalid status value', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          userId: 1,
          title: 'Test',
          status: 'invalid-status',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should handle invalid priority value', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          userId: 1,
          title: 'Test',
          priority: 'invalid-priority',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should handle invalid date format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          userId: 1,
          title: 'Test',
          dueDate: 'not-a-date',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /tasks - All Endpoints', () => {
    it('should return all tasks with correct structure', async () => {
      // Create multiple tasks
      await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: { userId: 1, title: 'Task 1', status: 'pending' },
      });
      await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: { userId: 2, title: 'Task 2', status: 'completed' },
      });

      const response = await app.inject({
        method: 'GET',
        url: '/tasks',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(2);
      expect(body.count).toBe(2);
      expect(body.data[0]).toHaveProperty('id');
      expect(body.data[0]).toHaveProperty('title');
      expect(body.data[0]).toHaveProperty('userId');
    });
  });

  describe('PUT /tasks/:id - Update Scenarios', () => {
    it('should update multiple fields at once', async () => {
      const createResponse = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          userId: 1,
          title: 'Original Title',
          description: 'Original Description',
          status: 'pending',
          priority: 'low',
        },
      });

      const taskId = JSON.parse(createResponse.body).data.id;

      const updateResponse = await app.inject({
        method: 'PUT',
        url: `/tasks/${taskId}`,
        payload: {
          title: 'Updated Title',
          description: 'Updated Description',
          status: 'in-progress',
          priority: 'high',
        },
      });

      expect(updateResponse.statusCode).toBe(200);
      const body = JSON.parse(updateResponse.body);
      expect(body.data.title).toBe('Updated Title');
      expect(body.data.description).toBe('Updated Description');
      expect(body.data.status).toBe('in-progress');
      expect(body.data.priority).toBe('high');
    });

    it('should allow partial updates', async () => {
      const createResponse = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          userId: 1,
          title: 'Original',
          status: 'pending',
        },
      });

      const taskId = JSON.parse(createResponse.body).data.id;

      const updateResponse = await app.inject({
        method: 'PUT',
        url: `/tasks/${taskId}`,
        payload: {
          status: 'completed',
        },
      });

      expect(updateResponse.statusCode).toBe(200);
      const body = JSON.parse(updateResponse.body);
      expect(body.data.status).toBe('completed');
      expect(body.data.title).toBe('Original'); // Unchanged
    });
  });

  describe('DELETE /tasks/:id - Delete Scenarios', () => {
    it('should return 404 for non-existent task', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/tasks/99999',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Task not found');
    });

    it('should successfully delete task and verify deletion', async () => {
      const createResponse = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          userId: 1,
          title: 'To Delete',
        },
      });

      const taskId = JSON.parse(createResponse.body).data.id;

      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: `/tasks/${taskId}`,
      });

      expect(deleteResponse.statusCode).toBe(200);
      const deleteBody = JSON.parse(deleteResponse.body);
      expect(deleteBody.success).toBe(true);

      // Verify task is deleted
      const getResponse = await app.inject({
        method: 'GET',
        url: `/tasks/${taskId}`,
      });

      expect(getResponse.statusCode).toBe(404);
    });
  });

  describe('GET /tasks/user/:userId - User Tasks', () => {
    it('should return empty array for user with no tasks', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/tasks/user/999',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data).toEqual([]);
      expect(body.count).toBe(0);
    });

    it('should return only tasks for specified user', async () => {
      // Create tasks for different users
      await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: { userId: 1, title: 'User 1 Task 1' },
      });
      await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: { userId: 1, title: 'User 1 Task 2' },
      });
      await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: { userId: 2, title: 'User 2 Task' },
      });

      const response = await app.inject({
        method: 'GET',
        url: '/tasks/user/1',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data).toHaveLength(2);
      expect(body.data.every(task => task.userId === 1)).toBe(true);
    });
  });
});
