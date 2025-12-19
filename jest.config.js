module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'services/**/*.js',
    '!services/**/node_modules/**',
    '!services/**/tests/**',
    '!services/**/*.test.js',
    '!services/**/server.js',
  ],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
  verbose: true,
};
