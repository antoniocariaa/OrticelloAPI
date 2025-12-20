const logger = require('../config/logger');

/**
 * Middleware per loggare gli errori non gestiti
 */
const errorLogger = (err, req, res, next) => {
  // Log dell'errore con stack trace
  logger.error(`Unhandled error: ${err.message}`, {
    error: err.name,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Passa l'errore al prossimo middleware
  next(err);
};

module.exports = errorLogger;
