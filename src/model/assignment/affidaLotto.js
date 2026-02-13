const mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Represents the assignment of a garden plot ("Lotto") to a user ("Utente").
 *
 * Defines the assignment interval with an optional list of crops ("colture").
 *
 * @typedef {Object} AffidaLotto
 * @property {import('mongoose').Types.ObjectId} lotto - Reference to the Lotto document. Required.
 * @property {import('mongoose').Types.ObjectId} utente - Reference to the Utente document. Required.
 * @property {Date} data_inizio - Assignment start date. Required.
 * @property {Date} data_fine - Assignment end date. Required.
 * @property {string[]} [colture] - Optional list of crops planted by the user.
 * @property {Date} [createdAt] - Auto-managed creation timestamp.
 * @property {Date} [updatedAt] - Auto-managed update timestamp.
 *
 * @see Lotto
 * @see Utente
 */
const affidaLotto = new Schema({

    lotto: {
        type: Schema.Types.ObjectId,
        ref: "Lotto",
        required: true
    },
    utente: {
        type: Schema.Types.ObjectId,
        ref: "Utente",
        required: true
    },
    data_richiesta: {
        type: Date,
        default: Date.now,
        required: true
    },
    stato: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    data_inizio: {  
        type: Date,
        required: false
    },  
    data_fine: {  
        type: Date,
        required: false
    },
    colture:[String] // possible future implementation of a list of colture planted by the user

}, { timestamps: true });

module.exports = mongoose.model("AffidaLotto", affidaLotto, "affidaLotto");
