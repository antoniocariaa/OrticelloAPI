const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Schema Mongoose per il modello "Comune".
 *
 * @typedef {Object} Comune
 * @property {string} nome - Nome del comune. Obbligatorio; spazi rimossi (trim).
 * @property {string} indirizzo - Indirizzo del comune. Obbligatorio; spazi rimossi (trim).
 * @property {string} telefono - Numero di telefono del comune. Obbligatorio; spazi rimossi (trim).
 * @property {string} email - Email del comune. Obbligatoria e univoca; deve essere valida (validator.isEmail).
 * @property {Date} [createdAt] - Data di creazione (aggiunta automaticamente).
 * @property {Date} [updatedAt] - Data dell'ultimo aggiornamento (aggiunta automaticamente).
 */
const comuneSchema = new Schema({
    nome: { type: String, required: true, trim: true },
    indirizzo: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
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

module.exports = mongoose.model("Comune", comuneSchema, "comune");
