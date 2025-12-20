const logger = require('../config/logger');

/**
 * Middleware per loggare tutte le richieste HTTP
 */
const requestLogger = (req, res, next) => {
  // Salva il timestamp di inizio richiesta
  req.startTime = Date.now();

  // Log della richiesta in arrivo
  logger.debug(`Incoming request`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    contentType: req.get('content-type')
  });

  // Intercetta la risposta per loggare quando è completata
  const originalSend = res.send;
  res.send = function (data) {
    res.send = originalSend; // Ripristina il metodo originale
    
    const duration = Date.now() - req.startTime;
    const statusCode = res.statusCode;
    
    // Log della risposta
    logger.http(req, statusCode, `Request completed in ${duration}ms`);
    
    return res.send(data);
  };

  next();
};

module.exports = requestLogger;
