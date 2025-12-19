module.exports = {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'jest',
  coverageAnalysis: 'perTest',
  mutate: [
    'services/**/src/**/*.js',
    '!services/**/src/**/*.test.js',
    '!services/**/src/server.js',
    '!services/**/src/app.js',
  ],
  jest: {
    projectType: 'custom',
    config: require('./jest.config.js'),
  },
  thresholds: {
    high: 80,
    low: 70,
    break: 60,
  },
};

