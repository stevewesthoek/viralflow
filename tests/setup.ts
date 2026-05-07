// Jest test setup

// Set test environment
process.env.NODE_ENV = 'test';

// Suppress logs during tests
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

afterAll(() => {
  jest.restoreAllMocks();
});
