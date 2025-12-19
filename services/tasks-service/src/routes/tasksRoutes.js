const TasksController = require('../controllers/TasksController');

const tasksController = new TasksController();

async function tasksRoutes(fastify, options) {
  // GET /tasks - отримати всі завдання
  fastify.get('/', tasksController.getAllTasks.bind(tasksController));

  // GET /tasks/:id - отримати завдання за ID
  fastify.get('/:id', tasksController.getTaskById.bind(tasksController));

  // GET /tasks/user/:userId - отримати завдання користувача
  fastify.get(
    '/user/:userId',
    tasksController.getTasksByUserId.bind(tasksController)
  );

  // POST /tasks - створити нове завдання
  fastify.post('/', tasksController.createTask.bind(tasksController));

  // PUT /tasks/:id - оновити завдання
  fastify.put('/:id', tasksController.updateTask.bind(tasksController));

  // DELETE /tasks/:id - видалити завдання
  fastify.delete('/:id', tasksController.deleteTask.bind(tasksController));
}

module.exports = tasksRoutes;
