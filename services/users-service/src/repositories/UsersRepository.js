const User = require('../models/User');

class UsersRepository {
  constructor() {
    // Статичні дані (in-memory storage)
    this.users = [
      new User({
        id: 1,
        username: 'john_doe',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: '2025-12-01T10:00:00.000Z',
        updatedAt: '2025-12-01T10:00:00.000Z',
      }),
      new User({
        id: 2,
        username: 'jane_smith',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        createdAt: '2025-12-05T14:30:00.000Z',
        updatedAt: '2025-12-05T14:30:00.000Z',
      }),
      new User({
        id: 3,
        username: 'bob_wilson',
        email: 'bob.wilson@example.com',
        firstName: 'Bob',
        lastName: 'Wilson',
        createdAt: '2025-12-10T09:15:00.000Z',
        updatedAt: '2025-12-10T09:15:00.000Z',
      }),
    ];
    this.nextId = 4;
  }

  findAll() {
    return this.users;
  }

  findById(id) {
    return this.users.find((user) => user.id === parseInt(id, 10));
  }

  findByUsername(username) {
    return this.users.find((user) => user.username === username);
  }

  findByEmail(email) {
    return this.users.find((user) => user.email === email);
  }

  create(userData) {
    const user = new User({
      ...userData,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    this.users.push(user);
    return user;
  }

  update(id, userData) {
    const user = this.findById(id);
    if (!user) {
      return null;
    }

    Object.assign(user, {
      ...userData,
      id: user.id, // Не дозволяємо змінювати id
      username: user.username, // Не дозволяємо змінювати username
      updatedAt: new Date().toISOString(),
    });

    return user;
  }

  delete(id) {
    const index = this.users.findIndex((user) => user.id === parseInt(id, 10));
    if (index === -1) {
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }
}

module.exports = UsersRepository;
