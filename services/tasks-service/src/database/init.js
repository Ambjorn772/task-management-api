const db = require('./dbConfig');

function initializeDatabase() {
  try {
    // Створення таблиці Tasks
    db.exec(`
      CREATE TABLE IF NOT EXISTS Tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'in-progress', 'completed', 'cancelled')),
        priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
        dueDate TEXT,
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Створення індексу для userId
    db.exec(`
      CREATE INDEX IF NOT EXISTS IX_Tasks_UserId ON Tasks(userId)
    `);

    // Вставка початкових даних (якщо таблиця порожня)
    const count = db.prepare('SELECT COUNT(*) as count FROM Tasks').get();
    if (count.count === 0) {
      const insert = db.prepare(`
        INSERT INTO Tasks (userId, title, description, status, priority, dueDate, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const tasks = [
        [
          1,
          'Завершити лабораторну роботу №3',
          'Імплементувати прототип зі статичними даними',
          'in-progress',
          'high',
          '2025-12-20T00:00:00.000Z',
          '2025-12-18T10:00:00.000Z',
          '2025-12-19T08:00:00.000Z',
        ],
        [
          1,
          'Написати тести для API',
          'Створити unit тести для всіх endpoints',
          'pending',
          'medium',
          '2025-12-25T00:00:00.000Z',
          '2025-12-18T11:00:00.000Z',
          '2025-12-18T11:00:00.000Z',
        ],
        [
          2,
          'Оновити документацію',
          'Додати опис нових endpoints',
          'completed',
          'low',
          '2025-12-15T00:00:00.000Z',
          '2025-12-10T09:00:00.000Z',
          '2025-12-15T14:00:00.000Z',
        ],
        [
          2,
          'Налаштувати CI/CD',
          'Налаштувати GitHub Actions',
          'pending',
          'high',
          '2025-12-30T00:00:00.000Z',
          '2025-12-19T12:00:00.000Z',
          '2025-12-19T12:00:00.000Z',
        ],
      ];

      const insertMany = db.transaction((tasks) => {
        for (const task of tasks) {
          insert.run(...task);
        }
      });

      insertMany(tasks);
      // eslint-disable-next-line no-console
      console.log('Initial data inserted into Tasks table');
    }

    // eslint-disable-next-line no-console
    console.log('Tasks database initialized successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Database initialization error:', error);
    throw error;
  }
}

module.exports = { initializeDatabase };
