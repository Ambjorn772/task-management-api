const User = require('../models/User');
const db = require('../database/dbConfig');

class UsersRepository {
  findAll() {
    try {
      const rows = db.prepare('SELECT * FROM Users ORDER BY createdAt DESC').all();
      return rows.map((row) => this.mapRowToUser(row));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  findById(id) {
    try {
      const row = db.prepare('SELECT * FROM Users WHERE id = ?').get(id);
      if (!row) {
        return null;
      }
      return this.mapRowToUser(row);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in findById:', error);
      throw error;
    }
  }

  findByUsername(username) {
    try {
      const row = db.prepare('SELECT * FROM Users WHERE username = ?').get(username);
      if (!row) {
        return null;
      }
      return this.mapRowToUser(row);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in findByUsername:', error);
      throw error;
    }
  }

  findByEmail(email) {
    try {
      const row = db.prepare('SELECT * FROM Users WHERE email = ?').get(email);
      if (!row) {
        return null;
      }
      return this.mapRowToUser(row);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in findByEmail:', error);
      throw error;
    }
  }

  create(userData) {
    try {
      const now = new Date().toISOString();
      const result = db
        .prepare(
          `INSERT INTO Users (username, email, firstName, lastName, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(
          userData.username,
          userData.email,
          userData.firstName || '',
          userData.lastName || '',
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

  update(id, userData) {
    try {
      const updates = [];
      const values = [];

      if (userData.email !== undefined) {
        updates.push('email = ?');
        values.push(userData.email);
      }
      if (userData.firstName !== undefined) {
        updates.push('firstName = ?');
        values.push(userData.firstName);
      }
      if (userData.lastName !== undefined) {
        updates.push('lastName = ?');
        values.push(userData.lastName);
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      updates.push('updatedAt = ?');
      values.push(new Date().toISOString());
      values.push(id);

      const result = db.prepare(`UPDATE Users SET ${updates.join(', ')} WHERE id = ?`).run(...values);

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
      const result = db.prepare('DELETE FROM Users WHERE id = ?').run(id);
      return result.changes > 0;
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
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

module.exports = UsersRepository;
