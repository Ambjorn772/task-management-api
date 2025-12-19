const express = require('express');
const TasksController = require('../controllers/TasksController');

const router = express.Router();
const tasksController = new TasksController();

// GET /tasks - отримати всі завдання
router.get('/', (req, res) => tasksController.getAllTasks(req, res));

// GET /tasks/:id - отримати завдання за ID
router.get('/:id', (req, res) => tasksController.getTaskById(req, res));

// GET /tasks/user/:userId - отримати завдання користувача
router.get('/user/:userId', (req, res) => tasksController.getTasksByUserId(req, res));

// POST /tasks - створити нове завдання
router.post('/', (req, res) => tasksController.createTask(req, res));

// PUT /tasks/:id - оновити завдання
router.put('/:id', (req, res) => tasksController.updateTask(req, res));

// DELETE /tasks/:id - видалити завдання
router.delete('/:id', (req, res) => tasksController.deleteTask(req, res));

module.exports = router;

