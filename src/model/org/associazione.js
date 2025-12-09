const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Schema Mongoose per l'entità "Associazione".
 *
 * @typedef {Object} Associazione
 * @property {string} nome Nome dell'associazione. Obbligatorio. Trim.
 * @property {string} indirizzo Indirizzo dell'associazione. Obbligatorio. Trim.
 * @property {string} telefono Numero di telefono. Obbligatorio. Validato con `validator.isMobilePhone`.
 * @property {string} email Indirizzo email. Obbligatorio e univoco. Validato con `validator.isEmail`.
 * @property {Date} createdAt Timestamp di creazione generato automaticamente.
 * @property {Date} updatedAt Timestamp di ultimo aggiornamento generato automaticamente.
 */
const associazioneSchema = new Schema({
  nome: { type: String, required: true, trim: true },
  indirizzo: { type: String, required: true, trim: true },
  telefono: {
    type: String,
    required: true,
    validate:{
        validator: function(v){
            return validator.isMobilePhone(v);
        },
        message: '{VALUE} non è un numero di telefono valido'
    } 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
        validator: function(v) {
        return validator.isEmail(v);
        },
        message: '{VALUE} non è un\'email valida'
    }
  },
}, { timestamps: true });

module.exports = mongoose.model("Associazione", associazioneSchema, "associazione");
