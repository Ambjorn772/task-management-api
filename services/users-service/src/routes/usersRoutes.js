const express = require('express');
const UsersController = require('../controllers/UsersController');

const router = express.Router();
const usersController = new UsersController();

// GET /users - отримати всіх користувачів
router.get('/', (req, res) => usersController.getAllUsers(req, res));

// GET /users/:id - отримати користувача за ID
router.get('/:id', (req, res) => usersController.getUserById(req, res));

// GET /users/:id/tasks - отримати завдання користувача (інтеграція з Tasks Service)
router.get('/:id/tasks', (req, res) => usersController.getUserTasks(req, res));

// POST /users - створити нового користувача
router.post('/', (req, res) => usersController.createUser(req, res));

// PUT /users/:id - оновити користувача
router.put('/:id', (req, res) => usersController.updateUser(req, res));

// DELETE /users/:id - видалити користувача
router.delete('/:id', (req, res) => usersController.deleteUser(req, res));

module.exports = router;
