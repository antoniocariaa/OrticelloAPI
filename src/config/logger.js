const fs = require('fs');
const path = require('path');

/**
 * Sistema di Logging Configurabile
 * 
 * Configurazione tramite variabili d'ambiente:
 * - LOG_LEVEL: debug|info|warn|error (default: info)
 * - LOG_ENABLED: true|false (default: true)
 * - LOG_TO_FILE: true|false (default: false)
 * - LOG_TO_CONSOLE: true|false (default: true)
 * - LOG_FILE_PATH: percorso del file di log (default: logs/app.log)
 */

class Logger {
  constructor() {
    // Configurazione da variabili d'ambiente
    this.enabled = process.env.LOG_ENABLED !== 'false';
    this.level = process.env.LOG_LEVEL || 'info';
    this.toFile = process.env.LOG_TO_FILE === 'true';
    this.toConsole = process.env.LOG_TO_CONSOLE !== 'false';
    this.filePath = process.env.LOG_FILE_PATH || path.join(process.cwd(), 'logs', 'app.log');
    
    // Livelli di log in ordine di priorità
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };

    // Colori per output console
    this.colors = {
      error: '\x1b[31m', // Rosso
      warn: '\x1b[33m',  // Giallo
      info: '\x1b[36m',  // Ciano
      debug: '\x1b[90m', // Grigio
      reset: '\x1b[0m'
    };

    // Crea directory logs se necessario
    if (this.toFile) {
      this.ensureLogDirectory();
    }
  }

  /**
   * Crea la directory dei log se non esiste
   */
  ensureLogDirectory() {
    const logDir = path.dirname(this.filePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  /**
   * Verifica se un livello di log deve essere registrato
   */
  shouldLog(level) {
    if (!this.enabled) return false;
    return this.levels[level] <= this.levels[this.level];
  }

  /**
   * Formatta il messaggio di log
   */
  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const contextStr = Object.keys(context).length > 0 
      ? ` | ${JSON.stringify(context)}` 
      : '';
    
    return `[${timestamp}] [${level.toUpperCase()}]${contextStr} - ${message}`;
  }

  /**
   * Scrive il log
   */
  write(level, message, context = {}) {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context);

    // Output su console
    if (this.toConsole) {
      const coloredMessage = `${this.colors[level]}${formattedMessage}${this.colors.reset}`;
      console.log(coloredMessage);
    }

    // Output su file
    if (this.toFile) {
      try {
        fs.appendFileSync(this.filePath, formattedMessage + '\n', 'utf8');
      } catch (error) {
        console.error('Errore nella scrittura del file di log:', error);
      }
    }
  }

  /**
   * Log di errore
   */
  error(message, context = {}) {
    this.write('error', message, context);
  }

  /**
   * Log di warning
   */
  warn(message, context = {}) {
    this.write('warn', message, context);
  }

  /**
   * Log informativo
   */
  info(message, context = {}) {
    this.write('info', message, context);
  }

  /**
   * Log di debug
   */
  debug(message, context = {}) {
    this.write('debug', message, context);
  }

  /**
   * Log specifico per richieste HTTP
   */
  http(req, statusCode, message = '') {
    const context = {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.connection.remoteAddress,
      statusCode,
      userAgent: req.get('user-agent')
    };

    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    this.write(level, message || `${req.method} ${req.originalUrl}`, context);
  }

  /**
   * Log per operazioni database
   */
  db(operation, model, success, details = {}) {
    const message = `DB ${operation} on ${model}: ${success ? 'SUCCESS' : 'FAILED'}`;
    const level = success ? 'info' : 'error';
    this.write(level, message, details);
  }

  /**
   * Log per autenticazione
   */
  auth(action, userId, success, details = {}) {
    const message = `Auth ${action} for user ${userId}: ${success ? 'SUCCESS' : 'FAILED'}`;
    const level = success ? 'info' : 'warn';
    this.write(level, message, details);
  }

  /**
   * Rotazione dei log (crea nuovo file se supera dimensione)
   */
  rotateIfNeeded() {
    if (!this.toFile) return;

    try {
      const stats = fs.statSync(this.filePath);
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (stats.size > maxSize) {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const newPath = this.filePath.replace('.log', `_${timestamp}.log`);
        fs.renameSync(this.filePath, newPath);
        this.info('Log file rotated', { oldFile: this.filePath, newFile: newPath });
      }
    } catch (error) {
      // File non esiste ancora, nessun problema
    }
  }
}

const logger = new Logger();

module.exports = logger;
