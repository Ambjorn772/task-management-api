const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath =
  process.env.DB_PATH || path.join(__dirname, '../../../data/users.db');
const dbDir = path.dirname(dbPath);

// Створюємо директорію для БД якщо не існує
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Увімкнути foreign keys
db.pragma('foreign_keys = ON');

// eslint-disable-next-line no-console
console.log(`Connected to SQLite database: ${dbPath}`);

module.exports = db;
