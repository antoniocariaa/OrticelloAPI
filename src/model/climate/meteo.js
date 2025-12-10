var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Meteo schema representing a meteorological observation.
 *
 * @typedef {Object} Meteo
 * @property {{lat: number, lng: number}} coordinate - Required geographic coordinates (WGS84).
 * @property {number} coordinate.lat - Required latitude in decimal degrees.
 * @property {number} coordinate.lng - Required longitude in decimal degrees.
 * @property {Date} timestamp - Required observation timestamp; defaults to current time and is indexed.
 * @property {string} [rilev] - Additional reading or notes (TODO: refine structure).
 */
var meteoSchema = new Schema({
  coordinate: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  timestamp: { 
    type: Date, 
    required: true,
    default: Date.now,
    index: true
  },
  rilev: String //TO DO 
});
module.exports = mongoose.model("Meteo", meteoSchema, "meteo");