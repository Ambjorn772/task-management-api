const fastify = require('fastify')({ logger: true });
const tasksRoutes = require('./routes/tasksRoutes');

// Реєстрація роутів
fastify.register(tasksRoutes, { prefix: '/tasks' });

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return reply.code(200).send({
    success: true,
    service: 'Tasks Service',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
fastify.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    success: false,
    error: 'Route not found',
  });
});

module.exports = fastify;
