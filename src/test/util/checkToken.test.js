const jwt = require('jsonwebtoken');
const checkToken = require('../../util/checkToken');

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

describe('checkToken middleware', () => {
  let req, res, next;
  const mockSecret = 'test-secret';

  beforeEach(() => {
    // Set environment variable
    process.env.SUPER_SECRET = mockSecret;

    req = {
      headers: {},
      query: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    next = jest.fn();

    // Reset mock
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.SUPER_SECRET;
  });

  describe('Token extraction from Authorization header', () => {
    it('should extract token from Bearer Authorization header', () => {
      const mockToken = 'valid.jwt.token';
      const mockDecoded = { userId: '123', tipo: 'comu' };
      
      req.headers['authorization'] = `Bearer ${mockToken}`;
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockDecoded);
      });

      checkToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockSecret, expect.any(Function));
      expect(req.loggedUser).toEqual(mockDecoded);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle Authorization header without Bearer prefix', () => {
      req.headers['authorization'] = 'invalid-format';

      checkToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'No token provided.'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Token extraction from custom header', () => {
    it('should extract token from x-access-token header', () => {
      const mockToken = 'custom.header.token';
      const mockDecoded = { userId: '456', tipo: 'asso' };
      
      req.headers['x-access-token'] = mockToken;
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockDecoded);
      });

      checkToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockSecret, expect.any(Function));
      expect(req.loggedUser).toEqual(mockDecoded);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Token extraction from query parameter', () => {
    it('should extract token from query parameter', () => {
      const mockToken = 'query.param.token';
      const mockDecoded = { userId: '789', tipo: 'user' };
      
      req.query.token = mockToken;
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockDecoded);
      });

      checkToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockSecret, expect.any(Function));
      expect(req.loggedUser).toEqual(mockDecoded);
      expect(next).toHaveBeenCalled();
    });

    it('should prioritize query parameter over x-access-token header', () => {
      const queryToken = 'query.token';
      const headerToken = 'header.token';
      const mockDecoded = { userId: '999' };
      
      req.query.token = queryToken;
      req.headers['x-access-token'] = headerToken;
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockDecoded);
      });

      checkToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(queryToken, mockSecret, expect.any(Function));
    });
  });

  describe('Token priority', () => {
    it('should prioritize Bearer token over other methods', () => {
      const bearerToken = 'bearer.token';
      const queryToken = 'query.token';
      const headerToken = 'header.token';
      const mockDecoded = { userId: '111' };
      
      req.headers['authorization'] = `Bearer ${bearerToken}`;
      req.query.token = queryToken;
      req.headers['x-access-token'] = headerToken;
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockDecoded);
      });

      checkToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(bearerToken, mockSecret, expect.any(Function));
    });
  });

  describe('Missing token', () => {
    it('should return 401 when no token is provided', () => {
      checkToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'No token provided.'
      });
      expect(next).not.toHaveBeenCalled();
      expect(jwt.verify).not.toHaveBeenCalled();
    });
  });

  describe('Token verification', () => {
    it('should return 403 when token verification fails', () => {
      const mockToken = 'invalid.token';
      
      req.headers['authorization'] = `Bearer ${mockToken}`;
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Token expired'), null);
      });

      checkToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to authenticate token.'
      });
      expect(next).not.toHaveBeenCalled();
      expect(req.loggedUser).toBeUndefined();
    });

    it('should successfully verify valid token', () => {
      const mockToken = 'valid.token';
      const mockDecoded = {
        userId: '12345',
        username: 'testuser',
        tipo: 'comu',
        admin: true
      };
      
      req.headers['authorization'] = `Bearer ${mockToken}`;
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockDecoded);
      });

      checkToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockSecret, expect.any(Function));
      expect(req.loggedUser).toEqual(mockDecoded);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty Bearer token', () => {
      req.headers['authorization'] = 'Bearer ';

      checkToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'No token provided.'
      });
    });

    it('should handle whitespace in Bearer token', () => {
      const mockToken = 'valid.token';
      const mockDecoded = { userId: '555' };
      
      req.headers['authorization'] = `Bearer ${mockToken}`;
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockDecoded);
      });

      checkToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockSecret, expect.any(Function));
      expect(next).toHaveBeenCalled();
    });

    it('should handle empty query token', () => {
      req.query.token = '';

      checkToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'No token provided.'
      });
    });
  });
});
