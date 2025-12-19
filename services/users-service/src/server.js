const app = require('./app');
const { initializeDatabase } = require('./database/init');
const { closePool } = require('./database/dbConfig');

const PORT = process.env.PORT || 3002;

async function startServer() {
  try {
    // Ініціалізація бази даних
    await initializeDatabase();

    // Запуск сервера
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Users Service is running on http://localhost:${PORT}`);
      // eslint-disable-next-line no-console
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  // eslint-disable-next-line no-console
  console.log('\nShutting down gracefully...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  // eslint-disable-next-line no-console
  console.log('\nShutting down gracefully...');
  await closePool();
  process.exit(0);
});

startServer();
