const { getPool, sql } = require('./dbConfig');

async function initializeDatabase() {
  try {
    const pool = await getPool();

    // Створення таблиці Tasks
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tasks' AND xtype='U')
      CREATE TABLE Tasks (
        id INT PRIMARY KEY IDENTITY(1,1),
        userId INT NOT NULL,
        title NVARCHAR(200) NOT NULL,
        description NVARCHAR(MAX),
        status NVARCHAR(20) NOT NULL DEFAULT 'pending',
        priority NVARCHAR(20) NOT NULL DEFAULT 'medium',
        dueDate DATETIME2,
        createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        updatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT CHK_Status CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
        CONSTRAINT CHK_Priority CHECK (priority IN ('low', 'medium', 'high'))
      )
    `);

    // Створення індексу для userId
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_Tasks_UserId')
      CREATE INDEX IX_Tasks_UserId ON Tasks(userId)
    `);

    // Вставка початкових даних (якщо таблиця порожня)
    const result = await pool.request().query('SELECT COUNT(*) as count FROM Tasks');
    if (result.recordset[0].count === 0) {
      await pool.request().query(`
        INSERT INTO Tasks (userId, title, description, status, priority, dueDate, createdAt, updatedAt)
        VALUES
          (1, N'Завершити лабораторну роботу №3', N'Імплементувати прототип зі статичними даними', 'in-progress', 'high', '2025-12-20', '2025-12-18 10:00:00', '2025-12-19 08:00:00'),
          (1, N'Написати тести для API', N'Створити unit тести для всіх endpoints', 'pending', 'medium', '2025-12-25', '2025-12-18 11:00:00', '2025-12-18 11:00:00'),
          (2, N'Оновити документацію', N'Додати опис нових endpoints', 'completed', 'low', '2025-12-15', '2025-12-10 09:00:00', '2025-12-15 14:00:00'),
          (2, N'Налаштувати CI/CD', N'Налаштувати GitHub Actions', 'pending', 'high', '2025-12-30', '2025-12-19 12:00:00', '2025-12-19 12:00:00')
      `);
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

