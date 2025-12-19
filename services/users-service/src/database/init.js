const db = require('./dbConfig');

function initializeDatabase() {
  try {
    // Створення таблиці Users
    db.exec(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        firstName TEXT,
        lastName TEXT,
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Створення індексів
    db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS IX_Users_Username ON Users(username)
    `);

    db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS IX_Users_Email ON Users(email)
    `);

    // Вставка початкових даних (якщо таблиця порожня)
    const count = db.prepare('SELECT COUNT(*) as count FROM Users').get();
    if (count.count === 0) {
      const insert = db.prepare(`
        INSERT INTO Users (username, email, firstName, lastName, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const users = [
        ['john_doe', 'john.doe@example.com', 'John', 'Doe', '2025-12-01T10:00:00.000Z', '2025-12-01T10:00:00.000Z'],
        ['jane_smith', 'jane.smith@example.com', 'Jane', 'Smith', '2025-12-05T14:30:00.000Z', '2025-12-05T14:30:00.000Z'],
        ['bob_wilson', 'bob.wilson@example.com', 'Bob', 'Wilson', '2025-12-10T09:15:00.000Z', '2025-12-10T09:15:00.000Z'],
      ];

      const insertMany = db.transaction((users) => {
        for (const user of users) {
          insert.run(...user);
        }
      });

      insertMany(users);
      // eslint-disable-next-line no-console
      console.log('Initial data inserted into Users table');
    }

    // eslint-disable-next-line no-console
    console.log('Users database initialized successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Database initialization error:', error);
    throw error;
  }
}

module.exports = { initializeDatabase };
