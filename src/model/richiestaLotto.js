var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Mongoose schema for a "RichiestaLotto" document.
 *
 * Represents a request from a user for a specific Lotto.
 *
 * @typedef {Object} RichiestaLotto
 * @property {import('mongoose').Types.ObjectId} id_lotto - Reference to the Lotto document. Required.
 * @property {import('mongoose').Types.ObjectId} id_utente - Reference to the Utente document. Required.
 * @property {Date} [data_richiesta] - Date of the request. Defaults to now.
 * @property {String} [stato] - Status of the request (e.g., "pending", "accepted", "rejected"). Defaults to "pending".
 */
var richiestaLottoSchema = new Schema({
    id_lotto: {
        type: Schema.Types.ObjectId,
        ref: "Lotto",
        required: true
    },
    id_utente: {
        type: Schema.Types.ObjectId,
        ref: "Utente",
        required: true
    },
    data_richiesta: {
        type: Date,
        default: Date.now
    },
    stato: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("RichiestaLotto", richiestaLottoSchema, "richiestaLotto");
