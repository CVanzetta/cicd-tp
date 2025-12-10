module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  testMatch: ['**/tests/**/*.test.js'],
  reporters: [
    'default',
    'jest-allure2-reporter',
  ],
};
