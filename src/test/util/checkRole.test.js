const checkRole = require('../../util/checkRole');

describe('checkRole middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      loggedUser: null,
      t: jest.fn((key) => key) // Mock della funzione di traduzione
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('Authentication check', () => {
    it('should return 401 if no logged user', () => {
      const middleware = checkRole(['comu']);
      
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'auth.unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Role type check', () => {
    it('should allow user with correct tipo', () => {
      req.loggedUser = { tipo: 'comu', admin: false };
      const middleware = checkRole(['comu']);
      
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow user with one of multiple allowed types', () => {
      req.loggedUser = { tipo: 'asso', admin: false };
      const middleware = checkRole(['comu', 'asso']);
      
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 if user tipo is not in allowed types', () => {
      req.loggedUser = { tipo: 'user', admin: false };
      const middleware = checkRole(['comu', 'asso']);
      
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'auth.unauthorized_role' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Admin check', () => {
    it('should allow admin user when admin is required', () => {
      req.loggedUser = { tipo: 'comu', admin: true };
      const middleware = checkRole(['comu'], true);
      
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 if admin is required but user is not admin', () => {
      req.loggedUser = { tipo: 'comu', admin: false };
      const middleware = checkRole(['comu'], true);
      
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'auth.unauthorized_admin' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow non-admin user when admin is not required', () => {
      req.loggedUser = { tipo: 'comu', admin: false };
      const middleware = checkRole(['comu'], false);
      
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should default requireAdmin to false when not specified', () => {
      req.loggedUser = { tipo: 'asso', admin: false };
      const middleware = checkRole(['asso']);
      
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Combined role and admin checks', () => {
    it('should reject if tipo is correct but admin is required and user is not admin', () => {
      req.loggedUser = { tipo: 'comu', admin: false };
      const middleware = checkRole(['comu', 'asso'], true);
      
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'auth.unauthorized_admin' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject if admin is true but tipo is wrong', () => {
      req.loggedUser = { tipo: 'user', admin: true };
      const middleware = checkRole(['comu'], true);
      
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'auth.unauthorized_role' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow if both tipo and admin requirements are met', () => {
      req.loggedUser = { tipo: 'asso', admin: true };
      const middleware = checkRole(['asso'], true);
      
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
