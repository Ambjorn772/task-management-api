class ValidationService {
  static validateTaskData(data) {
    const errors = [];

    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Title is required and must be a non-empty string');
    }

    if (data.title && data.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    if (data.userId === undefined || data.userId === null) {
      errors.push('UserId is required');
    }

    if (data.userId && (!Number.isInteger(Number(data.userId)) || Number(data.userId) <= 0)) {
      errors.push('UserId must be a positive integer');
    }

    if (data.status && !['pending', 'in-progress', 'completed', 'cancelled'].includes(data.status)) {
      errors.push("Status must be one of: 'pending', 'in-progress', 'completed', 'cancelled'");
    }

    if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
      errors.push("Priority must be one of: 'low', 'medium', 'high'");
    }

    if (data.dueDate && isNaN(Date.parse(data.dueDate))) {
      errors.push('DueDate must be a valid date');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateId(id) {
    const errors = [];

    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      errors.push('Id must be a positive integer');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

module.exports = ValidationService;

