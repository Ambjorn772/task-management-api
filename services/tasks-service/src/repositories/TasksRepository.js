const Task = require('../models/Task');
const db = require('../database/dbConfig');

class TasksRepository {
  findAll() {
    try {
      const rows = db.prepare('SELECT * FROM Tasks ORDER BY createdAt DESC').all();
      return rows.map((row) => this.mapRowToTask(row));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  findById(id) {
    try {
      const row = db.prepare('SELECT * FROM Tasks WHERE id = ?').get(id);
      if (!row) {
        return null;
      }
      return this.mapRowToTask(row);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in findById:', error);
      throw error;
    }
  }

  findByUserId(userId) {
    try {
      const rows = db.prepare('SELECT * FROM Tasks WHERE userId = ? ORDER BY createdAt DESC').all(userId);
      return rows.map((row) => this.mapRowToTask(row));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in findByUserId:', error);
      throw error;
    }
  }

  create(taskData) {
    try {
      const now = new Date().toISOString();
      const result = db
        .prepare(
          `INSERT INTO Tasks (userId, title, description, status, priority, dueDate, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          taskData.userId,
          taskData.title,
          taskData.description || '',
          taskData.status || 'pending',
          taskData.priority || 'medium',
          taskData.dueDate || null,
          now,
          now
        );

      return this.findById(result.lastInsertRowid);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in create:', error);
      throw error;
    }
  }

  update(id, taskData) {
    try {
      const updates = [];
      const values = [];

      if (taskData.title !== undefined) {
        updates.push('title = ?');
        values.push(taskData.title);
      }
      if (taskData.description !== undefined) {
        updates.push('description = ?');
        values.push(taskData.description);
      }
      if (taskData.status !== undefined) {
        updates.push('status = ?');
        values.push(taskData.status);
      }
      if (taskData.priority !== undefined) {
        updates.push('priority = ?');
        values.push(taskData.priority);
      }
      if (taskData.dueDate !== undefined) {
        updates.push('dueDate = ?');
        values.push(taskData.dueDate || null);
      }
      if (taskData.userId !== undefined) {
        updates.push('userId = ?');
        values.push(taskData.userId);
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      updates.push('updatedAt = ?');
      values.push(new Date().toISOString());
      values.push(id);

      const result = db.prepare(`UPDATE Tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);

      if (result.changes === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in update:', error);
      throw error;
    }
  }

  delete(id) {
    try {
      const result = db.prepare('DELETE FROM Tasks WHERE id = ?').run(id);
      return result.changes > 0;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in delete:', error);
      throw error;
    }
  }

  mapRowToTask(row) {
    return new Task({
      id: row.id,
      userId: row.userId,
      title: row.title,
      description: row.description || '',
      status: row.status,
      priority: row.priority,
      dueDate: row.dueDate || null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

module.exports = TasksRepository;
