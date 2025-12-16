const i18n = require('../config/i18n');

/**
 * Middleware per rilevare e impostare la lingua dell'utente
 * Controlla nell'ordine:
 * 1. Query parameter: ?lang=en
 * 2. Header personalizzato: X-Language
 * 3. Header Accept-Language del browser
 * 4. Lingua di default: it
 */
const detectLanguage = (req, res, next) => {
  let locale = 'it'; // Default

  // 1. Controlla query parameter
  if (req.query.lang) {
    locale = req.query.lang;
  }
  // 2. Controlla header personalizzato
  else if (req.headers['x-language']) {
    locale = req.headers['x-language'];
  }
  // 3. Controlla Accept-Language del browser
  else if (req.headers['accept-language']) {
    const acceptLanguage = req.headers['accept-language'];
    // Estrae la lingua principale (es: "en-US,en;q=0.9" -> "en")
    const primaryLang = acceptLanguage.split(',')[0].split('-')[0];
    
    // Verifica che sia una lingua supportata
    const supportedLocales = ['it', 'en', 'de', 'fr', 'es'];
    if (supportedLocales.includes(primaryLang)) {
      locale = primaryLang;
    }
  }

  // Imposta la locale per i18n
  i18n.setLocale(req, locale);
  
  // Rende disponibile la funzione di traduzione in req
  req.t = i18n.__;
  
  next();
};

module.exports = detectLanguage;
