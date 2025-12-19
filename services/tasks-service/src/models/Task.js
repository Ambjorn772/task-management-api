class Task {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title;
    this.description = data.description || '';
    this.status = data.status || 'pending';
    this.priority = data.priority || 'medium';
    this.dueDate = data.dueDate || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Task;

