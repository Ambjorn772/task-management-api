const ValidationService = require('../../src/services/ValidationService');

describe('ValidationService', () => {
  describe('validateTaskData', () => {
    it('should return valid for correct task data', () => {
      const data = {
        userId: 1,
        title: 'Valid Task',
        description: 'Description',
        status: 'pending',
        priority: 'high',
      };

      const result = ValidationService.validateTaskData(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return error when title is missing', () => {
      const data = {
        userId: 1,
      };

      const result = ValidationService.validateTaskData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required and must be a non-empty string');
    });

    it('should return error when title is empty', () => {
      const data = {
        userId: 1,
        title: '',
      };

      const result = ValidationService.validateTaskData(data);
      expect(result.isValid).toBe(false);
    });

    it('should return error when title is too long', () => {
      const data = {
        userId: 1,
        title: 'a'.repeat(201),
      };

      const result = ValidationService.validateTaskData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title must be less than 200 characters');
    });

    it('should return error when userId is missing', () => {
      const data = {
        title: 'Task',
      };

      const result = ValidationService.validateTaskData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('UserId is required');
    });

    it('should return error when userId is invalid', () => {
      const data = {
        userId: -1,
        title: 'Task',
      };

      const result = ValidationService.validateTaskData(data);
      expect(result.isValid).toBe(false);
    });

    it('should return error when status is invalid', () => {
      const data = {
        userId: 1,
        title: 'Task',
        status: 'invalid-status',
      };

      const result = ValidationService.validateTaskData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Status must be one of: 'pending', 'in-progress', 'completed', 'cancelled'");
    });

    it('should return error when priority is invalid', () => {
      const data = {
        userId: 1,
        title: 'Task',
        priority: 'invalid-priority',
      };

      const result = ValidationService.validateTaskData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Priority must be one of: 'low', 'medium', 'high'");
    });

    it('should return error when dueDate is invalid', () => {
      const data = {
        userId: 1,
        title: 'Task',
        dueDate: 'invalid-date',
      };

      const result = ValidationService.validateTaskData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('DueDate must be a valid date');
    });

    it('should allow optional fields for update operations', () => {
      const data = {
        status: 'completed',
      };

      const result = ValidationService.validateTaskData(data, true);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate provided fields even in update mode', () => {
      const data = {
        status: 'invalid-status',
      };

      const result = ValidationService.validateTaskData(data, true);
      expect(result.isValid).toBe(false);
    });

    it('should validate title length even in update mode', () => {
      const data = {
        title: 'a'.repeat(201),
      };

      const result = ValidationService.validateTaskData(data, true);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title must be less than 200 characters');
    });
  });

  describe('validateId', () => {
    it('should return valid for positive integer', () => {
      const result = ValidationService.validateId('1');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return error for negative number', () => {
      const result = ValidationService.validateId('-1');
      expect(result.isValid).toBe(false);
    });

    it('should return error for zero', () => {
      const result = ValidationService.validateId('0');
      expect(result.isValid).toBe(false);
    });

    it('should return error for non-numeric value', () => {
      const result = ValidationService.validateId('abc');
      expect(result.isValid).toBe(false);
    });

    it('should return error for empty string', () => {
      const result = ValidationService.validateId('');
      expect(result.isValid).toBe(false);
    });
  });
});
