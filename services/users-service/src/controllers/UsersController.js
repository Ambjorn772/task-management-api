const UsersRepository = require('../repositories/UsersRepository');
const ValidationService = require('../services/ValidationService');
const TasksClient = require('../clients/TasksClient');

class UsersController {
  constructor() {
    this.repository = new UsersRepository();
    this.tasksClient = new TasksClient();
  }

  async getAllUsers(request, reply) {
    try {
      const users = this.repository.findAll();
      return reply.code(200).send({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: error.message,
      });
    }
  }

  async getUserById(request, reply) {
    try {
      const { id } = request.params;
      const validation = ValidationService.validateId(id);

      if (!validation.isValid) {
        return reply.code(400).send({
          success: false,
          errors: validation.errors,
        });
      }

      const user = this.repository.findById(id);

      if (!user) {
        return reply.code(404).send({
          success: false,
          error: 'User not found',
        });
      }

      return reply.code(200).send({
        success: true,
        data: user,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: error.message,
      });
    }
  }

  async getUserTasks(request, reply) {
    try {
      const { id } = request.params;
      const validation = ValidationService.validateId(id);

      if (!validation.isValid) {
        return reply.code(400).send({
          success: false,
          errors: validation.errors,
        });
      }

      // Перевірка існування користувача
      const user = this.repository.findById(id);
      if (!user) {
        return reply.code(404).send({
          success: false,
          error: 'User not found',
        });
      }

      // Отримання завдань через Tasks Service
      try {
        const tasks = await this.tasksClient.getTasksByUserId(id);

        // Агрегація статистики
        const stats = {
          total: tasks.length,
          byStatus: {
            pending: tasks.filter((t) => t.status === 'pending').length,
            'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
            completed: tasks.filter((t) => t.status === 'completed').length,
            cancelled: tasks.filter((t) => t.status === 'cancelled').length,
          },
          byPriority: {
            high: tasks.filter((t) => t.priority === 'high').length,
            medium: tasks.filter((t) => t.priority === 'medium').length,
            low: tasks.filter((t) => t.priority === 'low').length,
          },
        };

        return reply.code(200).send({
          success: true,
          data: tasks,
          stats,
        });
      } catch (error) {
        return reply.code(503).send({
          success: false,
          error: 'Tasks Service is unavailable',
          message: error.message,
        });
      }
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: error.message,
      });
    }
  }

  async createUser(request, reply) {
    try {
      const validation = ValidationService.validateUserData(request.body);

      if (!validation.isValid) {
        return reply.code(400).send({
          success: false,
          errors: validation.errors,
        });
      }

      // Перевірка унікальності username
      const existingUserByUsername = this.repository.findByUsername(request.body.username);
      if (existingUserByUsername) {
        return reply.code(409).send({
          success: false,
          error: 'Username already exists',
        });
      }

      // Перевірка унікальності email
      const existingUserByEmail = this.repository.findByEmail(request.body.email);
      if (existingUserByEmail) {
        return reply.code(409).send({
          success: false,
          error: 'Email already exists',
        });
      }

      const user = this.repository.create(request.body);

      return reply.code(201).send({
        success: true,
        data: user,
      });
    } catch (error) {
      // Обробка помилок унікальності від БД
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        if (error.message.includes('username')) {
          return reply.code(409).send({
            success: false,
            error: 'Username already exists',
          });
        }
        if (error.message.includes('email')) {
          return reply.code(409).send({
            success: false,
            error: 'Email already exists',
          });
        }
      }

      return reply.code(500).send({
        success: false,
        error: error.message,
      });
    }
  }

  async updateUser(request, reply) {
    try {
      const { id } = request.params;
      const idValidation = ValidationService.validateId(id);

      if (!idValidation.isValid) {
        return reply.code(400).send({
          success: false,
          errors: idValidation.errors,
        });
      }

      const dataValidation = ValidationService.validateUserData(request.body);

      if (!dataValidation.isValid) {
        return reply.code(400).send({
          success: false,
          errors: dataValidation.errors,
        });
      }

      // Перевірка унікальності email (якщо змінюється)
      if (request.body.email) {
        const existingUser = this.repository.findByEmail(request.body.email);
        if (existingUser && existingUser.id !== parseInt(id, 10)) {
          return reply.code(409).send({
            success: false,
            error: 'Email already exists',
          });
        }
      }

      const user = this.repository.update(id, request.body);

      if (!user) {
        return reply.code(404).send({
          success: false,
          error: 'User not found',
        });
      }

      return reply.code(200).send({
        success: true,
        data: user,
      });
    } catch (error) {
      // Обробка помилок унікальності від БД
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return reply.code(409).send({
          success: false,
          error: 'Email already exists',
        });
      }

      return reply.code(500).send({
        success: false,
        error: error.message,
      });
    }
  }

  async deleteUser(request, reply) {
    try {
      const { id } = request.params;
      const validation = ValidationService.validateId(id);

      if (!validation.isValid) {
        return reply.code(400).send({
          success: false,
          errors: validation.errors,
        });
      }

      const deleted = this.repository.delete(id);

      if (!deleted) {
        return reply.code(404).send({
          success: false,
          error: 'User not found',
        });
      }

      return reply.code(200).send({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = UsersController;
