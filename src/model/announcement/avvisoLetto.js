var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Schema per tracciare quali avvisi sono stati letti da quali utenti
 * Implementa RF3 - Notice Consultation con tracking read/unread status
 */
var avvisoLettoSchema = new Schema({
  utente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utente',
    required: true,
    index: true
  },
  avviso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Avviso',
    required: true,
    index: true
  },
  dataLettura: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

// Indice composto per evitare duplicati e ottimizzare query
avvisoLettoSchema.index({ utente: 1, avviso: 1 }, { unique: true });

module.exports = mongoose.model("AvvisoLetto", avvisoLettoSchema, "avviso_letto");
