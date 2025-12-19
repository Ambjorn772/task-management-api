const sql = require('mssql');

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourPassword123',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'TaskManagement',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // Use true for Azure
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true' || true, // For local dev
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

async function getPool() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      // eslint-disable-next-line no-console
      console.log('Connected to MS SQL Server');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Database connection error:', error);
      throw error;
    }
  }
  return pool;
}

async function closePool() {
  if (pool) {
    await pool.close();
    pool = null;
    // eslint-disable-next-line no-console
    console.log('Database connection closed');
  }
}

module.exports = {
  getPool,
  closePool,
  sql,
};

