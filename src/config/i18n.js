const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['it', 'en', 'de', 'fr', 'es'],
  defaultLocale: 'it',
  directory: path.join(__dirname, '../locales'),
  objectNotation: true,
  updateFiles: false,
  syncFiles: false,
  api: {
    '__': 't',
    '__n': 'tn'
  },
  register: global
});

module.exports = i18n;
