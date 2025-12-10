const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Schema for assigning an Orto to an Associazione within a date range.
 * All fields are required; timestamps (createdAt, updatedAt) are enabled.
 *
 * @typedef {Object} AffidaOrto
 * @property {import('mongoose').Types.ObjectId} orto - Reference to the Orto document (ref: "Orto").
 * @property {import('mongoose').Types.ObjectId} associazione - Reference to the Associazione document (ref: "Associazione").
 * @property {Date} data_inizio - Start date of the assignment.
 * @property {Date} data_fine - End date of the assignment.
 * @property {Date} createdAt - Auto-managed creation timestamp.
 * @property {Date} updatedAt - Auto-managed update timestamp.
 */
const affidaOrto = new Schema({
  orto: {
    type: Schema.Types.ObjectId,
    ref: "Orto",
    required: true
  },
  associazione: {
    type: Schema.Types.ObjectId,
    ref: "Associazione",
    required: true
  },
  data_inizio: {
    type: Date,
    required: true
  },
  data_fine: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("AffidaOrto", affidaOrto, "affidaOrto");
