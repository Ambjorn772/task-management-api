const fastify = require('fastify')({ logger: true });
const usersRoutes = require('./routes/usersRoutes');

// Реєстрація роутів
fastify.register(usersRoutes, { prefix: '/users' });

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return reply.code(200).send({
    success: true,
    service: 'Users Service',
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
