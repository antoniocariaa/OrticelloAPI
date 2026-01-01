const detectLanguage = require('../../util/detectLanguage');

// Mock i18n module
jest.mock('../../config/i18n', () => ({
  setLocale: jest.fn(),
  __: jest.fn((key) => key)
}));

const i18n = require('../../config/i18n');

describe('detectLanguage middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      headers: {}
    };
    res = {};
    next = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Language detection priority', () => {
    it('should prioritize query parameter lang', () => {
      req.query.lang = 'en';
      req.headers['x-language'] = 'de';
      req.headers['accept-language'] = 'it-IT';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'en');
      expect(req.t).toBeDefined();
      expect(next).toHaveBeenCalled();
    });

    it('should use X-Language header when no query parameter', () => {
      req.headers['x-language'] = 'de';
      req.headers['accept-language'] = 'it-IT';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'de');
      expect(req.t).toBeDefined();
      expect(next).toHaveBeenCalled();
    });

    it('should use Accept-Language header as third priority', () => {
      req.headers['accept-language'] = 'en-US,en;q=0.9';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'en');
      expect(req.t).toBeDefined();
      expect(next).toHaveBeenCalled();
    });

    it('should default to "it" when no language info provided', () => {
      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'it');
      expect(req.t).toBeDefined();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Query parameter detection', () => {
    it('should detect Italian from query parameter', () => {
      req.query.lang = 'it';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'it');
      expect(next).toHaveBeenCalled();
    });

    it('should detect English from query parameter', () => {
      req.query.lang = 'en';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'en');
      expect(next).toHaveBeenCalled();
    });

    it('should detect German from query parameter', () => {
      req.query.lang = 'de';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'de');
      expect(next).toHaveBeenCalled();
    });

    it('should accept any value from query parameter (no validation)', () => {
      req.query.lang = 'fr'; // Not in supported list

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'fr');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('X-Language header detection', () => {
    it('should detect Italian from X-Language header', () => {
      req.headers['x-language'] = 'it';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'it');
      expect(next).toHaveBeenCalled();
    });

    it('should detect English from X-Language header', () => {
      req.headers['x-language'] = 'en';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'en');
      expect(next).toHaveBeenCalled();
    });

    it('should detect German from X-Language header', () => {
      req.headers['x-language'] = 'de';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'de');
      expect(next).toHaveBeenCalled();
    });

    it('should accept any value from X-Language header', () => {
      req.headers['x-language'] = 'es';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'es');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Accept-Language header detection', () => {
    it('should extract primary language from Accept-Language', () => {
      req.headers['accept-language'] = 'en-US,en;q=0.9,it;q=0.8';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'en');
      expect(next).toHaveBeenCalled();
    });

    it('should handle simple language code', () => {
      req.headers['accept-language'] = 'de';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'de');
      expect(next).toHaveBeenCalled();
    });

    it('should extract language from locale code', () => {
      req.headers['accept-language'] = 'it-IT';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'it');
      expect(next).toHaveBeenCalled();
    });

    it('should validate supported locales for Accept-Language', () => {
      req.headers['accept-language'] = 'fr-FR,fr;q=0.9'; // French not supported

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'it'); // Falls back to default
      expect(next).toHaveBeenCalled();
    });

    it('should handle complex Accept-Language with quality values', () => {
      req.headers['accept-language'] = 'en-US,en;q=0.9,de;q=0.8,it;q=0.7';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'en');
      expect(next).toHaveBeenCalled();
    });

    it('should default to "it" if Accept-Language has unsupported language', () => {
      req.headers['accept-language'] = 'zh-CN,zh;q=0.9'; // Chinese not supported

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'it');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Translation function setup', () => {
    it('should attach translation function to request', () => {
      req.query.lang = 'en';

      detectLanguage(req, res, next);

      expect(req.t).toBe(i18n.__);
      expect(next).toHaveBeenCalled();
    });

    it('should make translation function available regardless of locale', () => {
      detectLanguage(req, res, next);

      expect(req.t).toBeDefined();
      expect(typeof req.t).toBe('function');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty query parameter', () => {
      req.query.lang = '';

      detectLanguage(req, res, next);

      // Empty string is falsy, so it defaults to 'it'
      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'it');
      expect(next).toHaveBeenCalled();
    });

    it('should handle empty X-Language header', () => {
      req.headers['x-language'] = '';
      req.headers['accept-language'] = 'en-US';

      detectLanguage(req, res, next);

      // Empty string is falsy, so it falls through to Accept-Language
      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'en');
      expect(next).toHaveBeenCalled();
    });

    it('should handle malformed Accept-Language header', () => {
      req.headers['accept-language'] = '';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'it');
      expect(next).toHaveBeenCalled();
    });

    it('should handle case sensitivity in language codes', () => {
      req.query.lang = 'EN';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'EN');
      expect(next).toHaveBeenCalled();
    });

    it('should handle Accept-Language with wildcard', () => {
      req.headers['accept-language'] = '*';

      detectLanguage(req, res, next);

      expect(i18n.setLocale).toHaveBeenCalledWith(req, 'it');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Middleware flow', () => {
    it('should always call next() regardless of input', () => {
      detectLanguage(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);

      jest.clearAllMocks();
      req.query.lang = 'en';
      detectLanguage(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);

      jest.clearAllMocks();
      req.headers['accept-language'] = 'de-DE';
      detectLanguage(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
