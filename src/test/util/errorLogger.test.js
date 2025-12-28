const errorLogger = require('../../util/errorLogger');

// Mock logger module
jest.mock('../../config/logger', () => ({
  error: jest.fn()
}));

const logger = require('../../config/logger');

describe('errorLogger middleware', () => {
  let req, res, next, err;

  beforeEach(() => {
    req = {
      method: 'GET',
      originalUrl: '/api/test',
      ip: '127.0.0.1',
      connection: {
        remoteAddress: '192.168.1.1'
      },
      body: { key: 'value' },
      params: { id: '123' },
      query: { filter: 'active' }
    };
    res = {};
    next = jest.fn();
    err = new Error('Test error message');
    err.name = 'TestError';
    err.stack = 'Error: Test error message\n    at Test.test (test.js:10:15)';

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Error logging', () => {
    it('should log error with complete error information', () => {
      errorLogger(err, req, res, next);

      expect(logger.error).toHaveBeenCalledTimes(1);
      expect(logger.error).toHaveBeenCalledWith(
        'Unhandled error: Test error message',
        {
          error: 'TestError',
          stack: err.stack,
          method: 'GET',
          url: '/api/test',
          ip: '127.0.0.1',
          body: { key: 'value' },
          params: { id: '123' },
          query: { filter: 'active' }
        }
      );
    });

    it('should call next with the error', () => {
      errorLogger(err, req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('Request information logging', () => {
    it('should log request method', () => {
      req.method = 'POST';

      errorLogger(err, req, res, next);

      const loggedData = logger.error.mock.calls[0][1];
      expect(loggedData.method).toBe('POST');
    });

    it('should log original URL', () => {
      req.originalUrl = '/api/users/create';

      errorLogger(err, req, res, next);

      const loggedData = logger.error.mock.calls[0][1];
      expect(loggedData.url).toBe('/api/users/create');
    });

    it('should log request body', () => {
      req.body = { username: 'testuser', password: 'secret' };

      errorLogger(err, req, res, next);

      const loggedData = logger.error.mock.calls[0][1];
      expect(loggedData.body).toEqual({ username: 'testuser', password: 'secret' });
    });

    it('should log request params', () => {
      req.params = { userId: '456', postId: '789' };

      errorLogger(err, req, res, next);

      const loggedData = logger.error.mock.calls[0][1];
      expect(loggedData.params).toEqual({ userId: '456', postId: '789' });
    });

    it('should log request query', () => {
      req.query = { page: '1', limit: '10', sort: 'desc' };

      errorLogger(err, req, res, next);

      const loggedData = logger.error.mock.calls[0][1];
      expect(loggedData.query).toEqual({ page: '1', limit: '10', sort: 'desc' });
    });
  });

  describe('IP address logging', () => {
    it('should use req.ip when available', () => {
      req.ip = '192.168.1.100';

      errorLogger(err, req, res, next);

      const loggedData = logger.error.mock.calls[0][1];
      expect(loggedData.ip).toBe('192.168.1.100');
    });

    it('should fallback to connection.remoteAddress when req.ip is not available', () => {
      delete req.ip;
      req.connection.remoteAddress = '10.0.0.50';

      errorLogger(err, req, res, next);

      const loggedData = logger.error.mock.calls[0][1];
      expect(loggedData.ip).toBe('10.0.0.50');
    });

    it('should handle missing IP gracefully', () => {
      delete req.ip;
      delete req.connection.remoteAddress;

      errorLogger(err, req, res, next);

      const loggedData = logger.error.mock.calls[0][1];
      expect(loggedData.ip).toBeUndefined();
    });
  });

  describe('Error details logging', () => {
    it('should log error name', () => {
      err.name = 'ValidationError';

      errorLogger(err, req, res, next);

      const loggedData = logger.error.mock.calls[0][1];
      expect(loggedData.error).toBe('ValidationError');
    });

    it('should log error stack trace', () => {
      const customStack = 'Error: Custom\n    at custom.js:5:10';
      err.stack = customStack;

      errorLogger(err, req, res, next);

      const loggedData = logger.error.mock.calls[0][1];
      expect(loggedData.stack).toBe(customStack);
    });

    it('should log error message in the main log text', () => {
      err.message = 'Database connection failed';

      errorLogger(err, req, res, next);

      expect(logger.error).toHaveBeenCalledWith(
        'Unhandled error: Database connection failed',
        expect.any(Object)
      );
    });
  });

  describe('Different error types', () => {
    it('should handle TypeError', () => {
      const typeErr = new TypeError('Cannot read property of undefined');

      errorLogger(typeErr, req, res, next);

      expect(logger.error).toHaveBeenCalledWith(
        'Unhandled error: Cannot read property of undefined',
        expect.objectContaining({
          error: 'TypeError'
        })
      );
      expect(next).toHaveBeenCalledWith(typeErr);
    });

    it('should handle custom error objects', () => {
      const customErr = {
        name: 'CustomError',
        message: 'Custom error occurred',
        stack: 'CustomError stack trace'
      };

      errorLogger(customErr, req, res, next);

      expect(logger.error).toHaveBeenCalledWith(
        'Unhandled error: Custom error occurred',
        expect.objectContaining({
          error: 'CustomError',
          stack: 'CustomError stack trace'
        })
      );
      expect(next).toHaveBeenCalledWith(customErr);
    });

    it('should handle errors without stack trace', () => {
      const simpleErr = new Error('Simple error');
      delete simpleErr.stack;

      errorLogger(simpleErr, req, res, next);

      expect(logger.error).toHaveBeenCalledWith(
        'Unhandled error: Simple error',
        expect.objectContaining({
          error: 'Error',
          stack: undefined
        })
      );
    });
  });

  describe('Empty request data', () => {
    it('should handle empty request body', () => {
      req.body = {};

      errorLogger(err, req, res, next);

      const loggedData = logger.error.mock.calls[0][1];
      expect(loggedData.body).toEqual({});
    });

    it('should handle empty request params', () => {
      req.params = {};

      errorLogger(err, req, res, next);

      const loggedData = logger.error.mock.calls[0][1];
      expect(loggedData.params).toEqual({});
    });

    it('should handle empty request query', () => {
      req.query = {};

      errorLogger(err, req, res, next);

      const loggedData = logger.error.mock.calls[0][1];
      expect(loggedData.query).toEqual({});
    });
  });

  describe('Middleware chain', () => {
    it('should pass error to next middleware', () => {
      const specificError = new Error('Specific error');

      errorLogger(specificError, req, res, next);

      expect(next).toHaveBeenCalledWith(specificError);
    });

    it('should not modify the error object', () => {
      const originalError = new Error('Original error');
      const originalMessage = originalError.message;
      const originalStack = originalError.stack;

      errorLogger(originalError, req, res, next);

      expect(originalError.message).toBe(originalMessage);
      expect(originalError.stack).toBe(originalStack);
    });

    it('should log before calling next', () => {
      const callOrder = [];
      logger.error.mockImplementation(() => callOrder.push('logger'));
      next.mockImplementation(() => callOrder.push('next'));

      errorLogger(err, req, res, next);

      expect(callOrder).toEqual(['logger', 'next']);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle POST request with complex body', () => {
      req.method = 'POST';
      req.originalUrl = '/api/users';
      req.body = {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          address: {
            street: '123 Main St',
            city: 'Rome'
          }
        }
      };

      errorLogger(err, req, res, next);

      const loggedData = logger.error.mock.calls[0][1];
      expect(loggedData.method).toBe('POST');
      expect(loggedData.body).toEqual(req.body);
    });

    it('should handle errors during authentication', () => {
      const authErr = new Error('Invalid token');
      authErr.name = 'AuthenticationError';
      req.originalUrl = '/api/auth/login';
      req.body = { username: 'user', password: 'pass' };

      errorLogger(authErr, req, res, next);

      expect(logger.error).toHaveBeenCalledWith(
        'Unhandled error: Invalid token',
        expect.objectContaining({
          error: 'AuthenticationError',
          url: '/api/auth/login',
          body: { username: 'user', password: 'pass' }
        })
      );
    });
  });
});
