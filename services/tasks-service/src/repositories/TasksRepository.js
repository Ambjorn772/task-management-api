const Task = require('../models/Task');
const { getPool, sql } = require('../database/dbConfig');

class TasksRepository {
  async findAll() {
    try {
      const pool = await getPool();
      const result = await pool.request().query('SELECT * FROM Tasks ORDER BY createdAt DESC');
      return result.recordset.map((row) => this.mapRowToTask(row));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Tasks WHERE id = @id');

      if (result.recordset.length === 0) {
        return null;
      }

      return this.mapRowToTask(result.recordset[0]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM Tasks WHERE userId = @userId ORDER BY createdAt DESC');

      return result.recordset.map((row) => this.mapRowToTask(row));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in findByUserId:', error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input('userId', sql.Int, taskData.userId)
        .input('title', sql.NVarChar(200), taskData.title)
        .input('description', sql.NVarChar(sql.MAX), taskData.description || '')
        .input('status', sql.NVarChar(20), taskData.status || 'pending')
        .input('priority', sql.NVarChar(20), taskData.priority || 'medium')
        .input('dueDate', sql.DateTime2, taskData.dueDate || null)
        .query(
          `INSERT INTO Tasks (userId, title, description, status, priority, dueDate, createdAt, updatedAt)
           OUTPUT INSERTED.*
           VALUES (@userId, @title, @description, @status, @priority, @dueDate, GETDATE(), GETDATE())`
        );

      return this.mapRowToTask(result.recordset[0]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in create:', error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const pool = await getPool();

      // Створюємо динамічний SQL для оновлення тільки переданих полів
      const updates = [];
      const request = pool.request().input('id', sql.Int, id);

      if (taskData.title !== undefined) {
        updates.push('title = @title');
        request.input('title', sql.NVarChar(200), taskData.title);
      }
      if (taskData.description !== undefined) {
        updates.push('description = @description');
        request.input('description', sql.NVarChar(sql.MAX), taskData.description);
      }
      if (taskData.status !== undefined) {
        updates.push('status = @status');
        request.input('status', sql.NVarChar(20), taskData.status);
      }
      if (taskData.priority !== undefined) {
        updates.push('priority = @priority');
        request.input('priority', sql.NVarChar(20), taskData.priority);
      }
      if (taskData.dueDate !== undefined) {
        updates.push('dueDate = @dueDate');
        request.input('dueDate', sql.DateTime2, taskData.dueDate || null);
      }
      if (taskData.userId !== undefined) {
        updates.push('userId = @userId');
        request.input('userId', sql.Int, taskData.userId);
      }

      if (updates.length === 0) {
        // Якщо немає полів для оновлення, просто повертаємо існуючий запис
        return this.findById(id);
      }

      updates.push('updatedAt = GETDATE()');

      const result = await request.query(
        `UPDATE Tasks 
         SET ${updates.join(', ')}
         OUTPUT INSERTED.*
         WHERE id = @id`
      );

      if (result.recordset.length === 0) {
        return null;
      }

      return this.mapRowToTask(result.recordset[0]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in update:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Tasks WHERE id = @id');

      return result.rowsAffected[0] > 0;
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
      dueDate: row.dueDate ? new Date(row.dueDate).toISOString() : null,
      createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : new Date().toISOString(),
    });
  }
}

module.exports = TasksRepository;
