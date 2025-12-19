const ValidationService = require('../../src/services/ValidationService');

describe('Users ValidationService - Unit Tests', () => {
  describe('validateUserData', () => {
    test('should validate correct user data', () => {
      const validData = {
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      const result = ValidationService.validateUserData(validData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject user without username', () => {
      const invalidData = {
        email: 'test@example.com',
      };

      const result = ValidationService.validateUserData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Username'))).toBe(true);
    });

    test('should reject user without email', () => {
      const invalidData = {
        username: 'testuser',
      };

      const result = ValidationService.validateUserData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Email'))).toBe(true);
    });

    test('should reject user with invalid email format', () => {
      const invalidData = {
        username: 'testuser',
        email: 'invalid-email',
      };

      const result = ValidationService.validateUserData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Email'))).toBe(true);
    });

    test('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
      ];

      validEmails.forEach((email) => {
        const data = {
          username: 'testuser',
          email,
        };

        const result = ValidationService.validateUserData(data);
        expect(result.isValid).toBe(true);
      });
    });

    test('should reject username longer than 50 characters', () => {
      const invalidData = {
        username: 'a'.repeat(51),
        email: 'test@example.com',
      };

      const result = ValidationService.validateUserData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('50'))).toBe(true);
    });

    test('should reject email longer than 100 characters', () => {
      const invalidData = {
        username: 'testuser',
        email: 'a'.repeat(101) + '@example.com',
      };

      const result = ValidationService.validateUserData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('100'))).toBe(true);
    });

    test('should accept user without optional fields', () => {
      const validData = {
        username: 'testuser',
        email: 'test@example.com',
      };

      const result = ValidationService.validateUserData(validData);

      expect(result.isValid).toBe(true);
    });
  });

  describe('validateId', () => {
    test('should validate correct id', () => {
      const result = ValidationService.validateId('1');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject invalid id', () => {
      const result = ValidationService.validateId('0');

      expect(result.isValid).toBe(false);
    });
  });
});

