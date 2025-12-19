const UsersController = require('../controllers/UsersController');

const usersController = new UsersController();

async function usersRoutes(fastify, _options) {
  // GET /users - отримати всіх користувачів
  fastify.get('/', usersController.getAllUsers.bind(usersController));

  // GET /users/:id - отримати користувача за ID
  fastify.get('/:id', usersController.getUserById.bind(usersController));

  // GET /users/:id/tasks - отримати завдання користувача (інтеграція з Tasks Service)
  fastify.get('/:id/tasks', usersController.getUserTasks.bind(usersController));

  // POST /users - створити нового користувача
  fastify.post('/', usersController.createUser.bind(usersController));

  // PUT /users/:id - оновити користувача
  fastify.put('/:id', usersController.updateUser.bind(usersController));

  // DELETE /users/:id - видалити користувача
  fastify.delete('/:id', usersController.deleteUser.bind(usersController));
}

module.exports = usersRoutes;
