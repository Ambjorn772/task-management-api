const TasksRepository = require('../repositories/TasksRepository');
const ValidationService = require('../services/ValidationService');

class TasksController {
  constructor() {
    this.repository = new TasksRepository();
  }

  getAllTasks(req, res) {
    try {
      const tasks = this.repository.findAll();
      res.status(200).json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  getTaskById(req, res) {
    try {
      const { id } = req.params;
      const validation = ValidationService.validateId(id);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors,
        });
      }

      const task = this.repository.findById(id);

      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Task not found',
        });
      }

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  getTasksByUserId(req, res) {
    try {
      const { userId } = req.params;
      const validation = ValidationService.validateId(userId);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors,
        });
      }

      const tasks = this.repository.findByUserId(userId);

      res.status(200).json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  createTask(req, res) {
    try {
      const validation = ValidationService.validateTaskData(req.body);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors,
        });
      }

      const task = this.repository.create(req.body);

      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  updateTask(req, res) {
    try {
      const { id } = req.params;
      const idValidation = ValidationService.validateId(id);

      if (!idValidation.isValid) {
        return res.status(400).json({
          success: false,
          errors: idValidation.errors,
        });
      }

      const dataValidation = ValidationService.validateTaskData(req.body, true);

      if (!dataValidation.isValid) {
        return res.status(400).json({
          success: false,
          errors: dataValidation.errors,
        });
      }

      const task = this.repository.update(id, req.body);

      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Task not found',
        });
      }

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  deleteTask(req, res) {
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
          error: 'Task not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = TasksController;
