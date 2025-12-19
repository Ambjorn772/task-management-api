const { getPool, sql } = require('./dbConfig');

async function initializeDatabase() {
  try {
    const pool = await getPool();

    // Створення таблиці Users
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
      CREATE TABLE Users (
        id INT PRIMARY KEY IDENTITY(1,1),
        username NVARCHAR(50) NOT NULL UNIQUE,
        email NVARCHAR(100) NOT NULL UNIQUE,
        firstName NVARCHAR(50),
        lastName NVARCHAR(50),
        createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        updatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
      )
    `);

    // Створення індексів
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_Users_Username')
      CREATE UNIQUE INDEX IX_Users_Username ON Users(username)
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_Users_Email')
      CREATE UNIQUE INDEX IX_Users_Email ON Users(email)
    `);

    // Вставка початкових даних (якщо таблиця порожня)
    const result = await pool.request().query('SELECT COUNT(*) as count FROM Users');
    if (result.recordset[0].count === 0) {
      await pool.request().query(`
        INSERT INTO Users (username, email, firstName, lastName, createdAt, updatedAt)
        VALUES
          (N'john_doe', N'john.doe@example.com', N'John', N'Doe', '2025-12-01 10:00:00', '2025-12-01 10:00:00'),
          (N'jane_smith', N'jane.smith@example.com', N'Jane', N'Smith', '2025-12-05 14:30:00', '2025-12-05 14:30:00'),
          (N'bob_wilson', N'bob.wilson@example.com', N'Bob', N'Wilson', '2025-12-10 09:15:00', '2025-12-10 09:15:00')
      `);
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

