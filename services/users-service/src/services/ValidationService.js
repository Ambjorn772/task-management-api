class ValidationService {
  static validateUserData(data) {
    const errors = [];

    if (!data.username || typeof data.username !== 'string' || data.username.trim().length === 0) {
      errors.push('Username is required and must be a non-empty string');
    }

    if (data.username && data.username.length > 50) {
      errors.push('Username must be less than 50 characters');
    }

    if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
      errors.push('Email is required and must be a non-empty string');
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Email must be a valid email address');
    }

    if (data.email && data.email.length > 100) {
      errors.push('Email must be less than 100 characters');
    }

    if (data.firstName && typeof data.firstName !== 'string') {
      errors.push('FirstName must be a string');
    }

    if (data.firstName && data.firstName.length > 50) {
      errors.push('FirstName must be less than 50 characters');
    }

    if (data.lastName && typeof data.lastName !== 'string') {
      errors.push('LastName must be a string');
    }

    if (data.lastName && data.lastName.length > 50) {
      errors.push('LastName must be less than 50 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

