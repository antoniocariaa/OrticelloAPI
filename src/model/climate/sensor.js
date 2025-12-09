var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Sensor reading document stored via Mongoose.
 *
 * @typedef {Object} Sensor
 * @property {import('mongoose').Types.ObjectId} lotto Reference to the Lotto document (required).
 * @property {Date} timestamp Reading timestamp (required, defaults to now, indexed).
 * @property {string} [rilev] Sensor payload (TODO: define structure).
 */
var sensorSchema = new Schema({
  lotto: {
    type: Schema.Types.ObjectId,
    ref: "Lotto",
    required: true
  },
  timestamp: { 
    type: Date, 
    required: true,
    default: Date.now,
    index: true
  },
  rilev: String // TO DO
});
module.exports = mongoose.model("Meteo", sensorSchema, "meteo");