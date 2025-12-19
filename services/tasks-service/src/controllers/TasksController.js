const TasksRepository = require('../repositories/TasksRepository');
const ValidationService = require('../services/ValidationService');

class TasksController {
  constructor() {
    this.repository = new TasksRepository();
  }

  async getAllTasks(request, reply) {
    try {
      const tasks = this.repository.findAll();
      return reply.code(200).send({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: error.message,
      });
    }
  }

  async getTaskById(request, reply) {
    try {
      const { id } = request.params;
      const validation = ValidationService.validateId(id);

      if (!validation.isValid) {
        return reply.code(400).send({
          success: false,
          errors: validation.errors,
        });
      }

      const task = this.repository.findById(id);

      if (!task) {
        return reply.code(404).send({
          success: false,
          error: 'Task not found',
        });
      }

      return reply.code(200).send({
        success: true,
        data: task,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: error.message,
      });
    }
  }

  async getTasksByUserId(request, reply) {
    try {
      const { userId } = request.params;
      const validation = ValidationService.validateId(userId);

      if (!validation.isValid) {
        return reply.code(400).send({
          success: false,
          errors: validation.errors,
        });
      }

      const tasks = this.repository.findByUserId(userId);

      return reply.code(200).send({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: error.message,
      });
    }
  }

  async createTask(request, reply) {
    try {
      const validation = ValidationService.validateTaskData(request.body);

      if (!validation.isValid) {
        return reply.code(400).send({
          success: false,
          errors: validation.errors,
        });
      }

      const task = this.repository.create(request.body);

      return reply.code(201).send({
        success: true,
        data: task,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: error.message,
      });
    }
  }

  async updateTask(request, reply) {
    try {
      const { id } = request.params;
      const idValidation = ValidationService.validateId(id);

      if (!idValidation.isValid) {
        return reply.code(400).send({
          success: false,
          errors: idValidation.errors,
        });
      }

      const dataValidation = ValidationService.validateTaskData(
        request.body,
        true
      );

      if (!dataValidation.isValid) {
        return reply.code(400).send({
          success: false,
          errors: dataValidation.errors,
        });
      }

      const task = this.repository.update(id, request.body);

      if (!task) {
        return reply.code(404).send({
          success: false,
          error: 'Task not found',
        });
      }

      return reply.code(200).send({
        success: true,
        data: task,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: error.message,
      });
    }
  }

  async deleteTask(request, reply) {
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
          error: 'Task not found',
        });
      }

      return reply.code(200).send({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = TasksController;
