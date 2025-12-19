const app = require('./app');
const { initializeDatabase } = require('./database/init');

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Ініціалізація бази даних
    initializeDatabase();

    // Запуск сервера
    await app.listen({ port: PORT, host: '0.0.0.0' });
    // eslint-disable-next-line no-console
    console.log(`Tasks Service is running on http://localhost:${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`Health check: http://localhost:${PORT}/health`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  // eslint-disable-next-line no-console
  console.log('\nShutting down gracefully...');
  await app.close();
  // eslint-disable-next-line no-process-exit
  process.exit(0);
});

process.on('SIGTERM', async () => {
  // eslint-disable-next-line no-console
  console.log('\nShutting down gracefully...');
  await app.close();
  // eslint-disable-next-line no-process-exit
  process.exit(0);
});

startServer();
