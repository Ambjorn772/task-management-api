const User = require('../models/User');
const { getPool, sql } = require('../database/dbConfig');

class UsersRepository {
  async findAll() {
    try {
      const pool = await getPool();
      const result = await pool.request().query('SELECT * FROM Users ORDER BY createdAt DESC');
      return result.recordset.map((row) => this.mapRowToUser(row));
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
        .query('SELECT * FROM Users WHERE id = @id');

      if (result.recordset.length === 0) {
        return null;
      }

      return this.mapRowToUser(result.recordset[0]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async findByUsername(username) {
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input('username', sql.NVarChar(50), username)
        .query('SELECT * FROM Users WHERE username = @username');

      if (result.recordset.length === 0) {
        return null;
      }

      return this.mapRowToUser(result.recordset[0]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in findByUsername:', error);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input('email', sql.NVarChar(100), email)
        .query('SELECT * FROM Users WHERE email = @email');

      if (result.recordset.length === 0) {
        return null;
      }

      return this.mapRowToUser(result.recordset[0]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in findByEmail:', error);
      throw error;
    }
  }

  async create(userData) {
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input('username', sql.NVarChar(50), userData.username)
        .input('email', sql.NVarChar(100), userData.email)
        .input('firstName', sql.NVarChar(50), userData.firstName || '')
        .input('lastName', sql.NVarChar(50), userData.lastName || '')
        .query(
          `INSERT INTO Users (username, email, firstName, lastName, createdAt, updatedAt)
           OUTPUT INSERTED.*
           VALUES (@username, @email, @firstName, @lastName, GETDATE(), GETDATE())`
        );

      return this.mapRowToUser(result.recordset[0]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in create:', error);
      throw error;
    }
  }

  async update(id, userData) {
    try {
      const pool = await getPool();

      // Створюємо динамічний SQL для оновлення тільки переданих полів
      const updates = [];
      const request = pool.request().input('id', sql.Int, id);

      if (userData.email !== undefined) {
        updates.push('email = @email');
        request.input('email', sql.NVarChar(100), userData.email);
      }
      if (userData.firstName !== undefined) {
        updates.push('firstName = @firstName');
        request.input('firstName', sql.NVarChar(50), userData.firstName);
      }
      if (userData.lastName !== undefined) {
        updates.push('lastName = @lastName');
        request.input('lastName', sql.NVarChar(50), userData.lastName);
      }

      if (updates.length === 0) {
        // Якщо немає полів для оновлення, просто повертаємо існуючий запис
        return this.findById(id);
      }

      updates.push('updatedAt = GETDATE()');

      const result = await request.query(
        `UPDATE Users 
         SET ${updates.join(', ')}
         OUTPUT INSERTED.*
         WHERE id = @id`
      );

      if (result.recordset.length === 0) {
        return null;
      }

      return this.mapRowToUser(result.recordset[0]);
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
        .query('DELETE FROM Users WHERE id = @id');

      return result.rowsAffected[0] > 0;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in delete:', error);
      throw error;
    }
  }

  mapRowToUser(row) {
    return new User({
      id: row.id,
      username: row.username,
      email: row.email,
      firstName: row.firstName || '',
      lastName: row.lastName || '',
      createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : new Date().toISOString(),
    });
  }
}

module.exports = UsersRepository;
