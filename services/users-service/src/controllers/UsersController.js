const UsersRepository = require('../repositories/UsersRepository');
const ValidationService = require('../services/ValidationService');
const TasksClient = require('../clients/TasksClient');

class UsersController {
  constructor() {
    this.repository = new UsersRepository();
    this.tasksClient = new TasksClient();
  }

  getAllUsers(req, res) {
    try {
      const users = this.repository.findAll();
      res.status(200).json({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  getUserById(req, res) {
    try {
      const { id } = req.params;
      const validation = ValidationService.validateId(id);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors,
        });
      }

      const user = this.repository.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getUserTasks(req, res) {
    try {
      const { id } = req.params;
      const validation = ValidationService.validateId(id);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors,
        });
      }

      // Перевірка існування користувача
      const user = this.repository.findById(id);
      if (!user) {
        return res.status(404).json({
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
            'in-progress': tasks.filter((t) => t.status === 'in-progress')
              .length,
            completed: tasks.filter((t) => t.status === 'completed').length,
            cancelled: tasks.filter((t) => t.status === 'cancelled').length,
          },
          byPriority: {
            high: tasks.filter((t) => t.priority === 'high').length,
            medium: tasks.filter((t) => t.priority === 'medium').length,
            low: tasks.filter((t) => t.priority === 'low').length,
          },
        };

        res.status(200).json({
          success: true,
          data: tasks,
          stats,
        });
      } catch (error) {
        res.status(503).json({
          success: false,
          error: 'Tasks Service is unavailable',
          message: error.message,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  createUser(req, res) {
    try {
      const validation = ValidationService.validateUserData(req.body);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors,
        });
      }

      // Перевірка унікальності username
      const existingUserByUsername = this.repository.findByUsername(
        req.body.username
      );
      if (existingUserByUsername) {
        return res.status(409).json({
          success: false,
          error: 'Username already exists',
        });
      }

      // Перевірка унікальності email
      const existingUserByEmail = this.repository.findByEmail(req.body.email);
      if (existingUserByEmail) {
        return res.status(409).json({
          success: false,
          error: 'Email already exists',
        });
      }

      const user = this.repository.create(req.body);

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  updateUser(req, res) {
    try {
      const { id } = req.params;
      const idValidation = ValidationService.validateId(id);

      if (!idValidation.isValid) {
        return res.status(400).json({
          success: false,
          errors: idValidation.errors,
        });
      }

      const dataValidation = ValidationService.validateUserData(req.body);

      if (!dataValidation.isValid) {
        return res.status(400).json({
          success: false,
          errors: dataValidation.errors,
        });
      }

      // Перевірка унікальності email (якщо змінюється)
      if (req.body.email) {
        const existingUser = this.repository.findByEmail(req.body.email);
        if (existingUser && existingUser.id !== parseInt(id, 10)) {
          return res.status(409).json({
            success: false,
            error: 'Email already exists',
          });
        }
      }

      const user = this.repository.update(id, req.body);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  deleteUser(req, res) {
    try {
      const { id } = req.params;
      const validation = ValidationService.validateId(id);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors,
        });
      }

      const deleted = this.repository.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = UsersController;
