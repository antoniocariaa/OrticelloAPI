const requestLogger = require('../../util/requestLogger');

// Mock logger module
jest.mock('../../config/logger', () => ({
  debug: jest.fn(),
  http: jest.fn()
}));

const logger = require('../../config/logger');

describe('requestLogger middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      method: 'GET',
      originalUrl: '/api/test',
      ip: '127.0.0.1',
      connection: {
        remoteAddress: '192.168.1.1'
      },
      get: jest.fn((header) => {
        const headers = {
          'user-agent': 'Mozilla/5.0',
          'content-type': 'application/json'
        };
        return headers[header];
      })
    };
    res = {
      send: jest.fn(),
      statusCode: 200
    };
    next = jest.fn();

    // Reset mocks
    jest.clearAllMocks();

    // Mock Date.now() for consistent timing
    jest.spyOn(Date, 'now').mockReturnValue(1000000);
  });

  afterEach(() => {
    Date.now.mockRestore();
  });

  describe('Request logging', () => {
    it('should log incoming request with details', () => {
      requestLogger(req, res, next);

      expect(logger.debug).toHaveBeenCalledTimes(1);
      expect(logger.debug).toHaveBeenCalledWith(
        'Incoming request',
        {
          method: 'GET',
          url: '/api/test',
          ip: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
          contentType: 'application/json'
        }
      );
    });

    it('should set startTime on request object', () => {
      requestLogger(req, res, next);

      expect(req.startTime).toBe(1000000);
    });

    it('should call next middleware', () => {
      requestLogger(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('Response logging', () => {
    it('should log response when send is called', () => {
      requestLogger(req, res, next);

      // Simulate some time passing
      Date.now.mockReturnValue(1000250); // 250ms later

      // Simulate response
      res.send('response data');

      expect(logger.http).toHaveBeenCalledTimes(1);
      expect(logger.http).toHaveBeenCalledWith(
        req,
        200,
        'Request completed in 250ms'
      );
    });

    it('should calculate correct duration', () => {
      requestLogger(req, res, next);

      // Simulate different durations
      Date.now.mockReturnValue(1001500); // 1500ms later

      res.send('data');

      expect(logger.http).toHaveBeenCalledWith(
        req,
        200,
        'Request completed in 1500ms'
      );
    });

    it('should log correct status code', () => {
      requestLogger(req, res, next);

      res.statusCode = 404;
      Date.now.mockReturnValue(1000100);

      res.send('Not found');

      expect(logger.http).toHaveBeenCalledWith(
        req,
        404,
        'Request completed in 100ms'
      );
    });

    it('should restore original send method', () => {
      const originalSend = res.send;
      requestLogger(req, res, next);

      const interceptedSend = res.send;
      expect(interceptedSend).not.toBe(originalSend);

      // Call the intercepted send
      Date.now.mockReturnValue(1000100);
      res.send('data');

      // After first call, should be restored
      expect(res.send).toBe(originalSend);
    });

    it('should return the result of original send', () => {
      const mockData = { message: 'test data' };
      res.send.mockReturnValue('send result');

      requestLogger(req, res, next);

      Date.now.mockReturnValue(1000100);
      const result = res.send(mockData);

      expect(result).toBe('send result');
      expect(res.send).toHaveBeenCalledWith(mockData);
    });
  });

  describe('Request details logging', () => {
    it('should log POST method', () => {
      req.method = 'POST';

      requestLogger(req, res, next);

      const loggedData = logger.debug.mock.calls[0][1];
      expect(loggedData.method).toBe('POST');
    });

    it('should log PUT method', () => {
      req.method = 'PUT';

      requestLogger(req, res, next);

      const loggedData = logger.debug.mock.calls[0][1];
      expect(loggedData.method).toBe('PUT');
    });

    it('should log DELETE method', () => {
      req.method = 'DELETE';

      requestLogger(req, res, next);

      const loggedData = logger.debug.mock.calls[0][1];
      expect(loggedData.method).toBe('DELETE');
    });

    it('should log different URLs', () => {
      req.originalUrl = '/api/users/123/posts';

      requestLogger(req, res, next);

      const loggedData = logger.debug.mock.calls[0][1];
      expect(loggedData.url).toBe('/api/users/123/posts');
    });

    it('should log user agent', () => {
      req.get.mockReturnValue('Chrome/120.0');

      requestLogger(req, res, next);

      const loggedData = logger.debug.mock.calls[0][1];
      expect(loggedData.userAgent).toBe('Chrome/120.0');
    });

    it('should log content type', () => {
      req.get.mockImplementation((header) => {
        if (header === 'content-type') return 'text/html';
        if (header === 'user-agent') return 'Mozilla';
        return undefined;
      });

      requestLogger(req, res, next);

      const loggedData = logger.debug.mock.calls[0][1];
      expect(loggedData.contentType).toBe('text/html');
    });
  });

  describe('IP address logging', () => {
    it('should use req.ip when available', () => {
      req.ip = '192.168.1.100';

      requestLogger(req, res, next);

      const loggedData = logger.debug.mock.calls[0][1];
      expect(loggedData.ip).toBe('192.168.1.100');
    });

    it('should fallback to connection.remoteAddress when req.ip is not available', () => {
      delete req.ip;
      req.connection.remoteAddress = '10.0.0.50';

      requestLogger(req, res, next);

      const loggedData = logger.debug.mock.calls[0][1];
      expect(loggedData.ip).toBe('10.0.0.50');
    });

    it('should handle missing IP gracefully', () => {
      delete req.ip;
      delete req.connection.remoteAddress;

      requestLogger(req, res, next);

      const loggedData = logger.debug.mock.calls[0][1];
      expect(loggedData.ip).toBeUndefined();
    });
  });

  describe('Response status codes', () => {
    it('should log 200 status code', () => {
      requestLogger(req, res, next);

      res.statusCode = 200;
      Date.now.mockReturnValue(1000100);
      res.send('OK');

      expect(logger.http).toHaveBeenCalledWith(req, 200, expect.any(String));
    });

    it('should log 201 status code', () => {
      requestLogger(req, res, next);

      res.statusCode = 201;
      Date.now.mockReturnValue(1000100);
      res.send('Created');

      expect(logger.http).toHaveBeenCalledWith(req, 201, expect.any(String));
    });

    it('should log 400 status code', () => {
      requestLogger(req, res, next);

      res.statusCode = 400;
      Date.now.mockReturnValue(1000100);
      res.send('Bad Request');

      expect(logger.http).toHaveBeenCalledWith(req, 400, expect.any(String));
    });

    it('should log 401 status code', () => {
      requestLogger(req, res, next);

      res.statusCode = 401;
      Date.now.mockReturnValue(1000100);
      res.send('Unauthorized');

      expect(logger.http).toHaveBeenCalledWith(req, 401, expect.any(String));
    });

    it('should log 404 status code', () => {
      requestLogger(req, res, next);

      res.statusCode = 404;
      Date.now.mockReturnValue(1000100);
      res.send('Not Found');

      expect(logger.http).toHaveBeenCalledWith(req, 404, expect.any(String));
    });

    it('should log 500 status code', () => {
      requestLogger(req, res, next);

      res.statusCode = 500;
      Date.now.mockReturnValue(1000100);
      res.send('Internal Server Error');

      expect(logger.http).toHaveBeenCalledWith(req, 500, expect.any(String));
    });
  });

  describe('Timing measurements', () => {
    it('should measure very fast requests (1ms)', () => {
      requestLogger(req, res, next);

      Date.now.mockReturnValue(1000001); // 1ms later
      res.send('data');

      expect(logger.http).toHaveBeenCalledWith(
        req,
        200,
        'Request completed in 1ms'
      );
    });

    it('should measure slow requests (5000ms)', () => {
      requestLogger(req, res, next);

      Date.now.mockReturnValue(1005000); // 5000ms later
      res.send('data');

      expect(logger.http).toHaveBeenCalledWith(
        req,
        200,
        'Request completed in 5000ms'
      );
    });

    it('should handle 0ms duration', () => {
      requestLogger(req, res, next);

      Date.now.mockReturnValue(1000000); // Same time
      res.send('data');

      expect(logger.http).toHaveBeenCalledWith(
        req,
        200,
        'Request completed in 0ms'
      );
    });
  });

  describe('Header access', () => {
    it('should handle missing user-agent header', () => {
      req.get.mockReturnValue(undefined);

      requestLogger(req, res, next);

      const loggedData = logger.debug.mock.calls[0][1];
      expect(loggedData.userAgent).toBeUndefined();
    });

    it('should handle missing content-type header', () => {
      req.get.mockImplementation((header) => {
        if (header === 'user-agent') return 'Mozilla';
        return undefined;
      });

      requestLogger(req, res, next);

      const loggedData = logger.debug.mock.calls[0][1];
      expect(loggedData.contentType).toBeUndefined();
    });

    it('should call req.get with correct header names', () => {
      requestLogger(req, res, next);

      expect(req.get).toHaveBeenCalledWith('user-agent');
      expect(req.get).toHaveBeenCalledWith('content-type');
    });
  });

  describe('Multiple requests', () => {
    it('should handle multiple sequential requests independently', () => {
      // First request
      const req1 = { ...req };
      const res1 = { ...res, send: jest.fn(), statusCode: 200 };
      
      Date.now.mockReturnValue(1000000);
      requestLogger(req1, res1, next);

      Date.now.mockReturnValue(1000100);
      res1.send('data1');

      // Second request
      const req2 = { ...req };
      const res2 = { ...res, send: jest.fn(), statusCode: 404 };
      
      Date.now.mockReturnValue(2000000);
      requestLogger(req2, res2, next);

      Date.now.mockReturnValue(2000300);
      res2.send('data2');

      expect(logger.http).toHaveBeenNthCalledWith(
        1,
        req1,
        200,
        'Request completed in 100ms'
      );

      expect(logger.http).toHaveBeenNthCalledWith(
        2,
        req2,
        404,
        'Request completed in 300ms'
      );
    });
  });

  describe('Middleware integration', () => {
    it('should not prevent response from being sent', () => {
      const responseData = { message: 'Success' };
      res.send.mockImplementation((data) => {
        expect(data).toEqual(responseData);
        return res;
      });

      requestLogger(req, res, next);

      Date.now.mockReturnValue(1000100);
      res.send(responseData);

      expect(res.send).toHaveBeenCalledWith(responseData);
    });

    it('should work in middleware chain', () => {
      requestLogger(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(logger.debug).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle requests without originalUrl', () => {
      req.originalUrl = '';

      requestLogger(req, res, next);

      const loggedData = logger.debug.mock.calls[0][1];
      expect(loggedData.url).toBe('');
    });

    it('should handle requests with query parameters in URL', () => {
      req.originalUrl = '/api/users?page=1&limit=10';

      requestLogger(req, res, next);

      const loggedData = logger.debug.mock.calls[0][1];
      expect(loggedData.url).toBe('/api/users?page=1&limit=10');
    });

    it('should handle requests with hash in URL', () => {
      req.originalUrl = '/api/resource#section';

      requestLogger(req, res, next);

      const loggedData = logger.debug.mock.calls[0][1];
      expect(loggedData.url).toBe('/api/resource#section');
    });
  });
});
