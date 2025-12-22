var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Meteo schema representing a meteorological observation.
 *
 * @typedef {Object} Meteo
 * @property {Object} geometry - GeoJSON geometry representing the weather station location (Point).
 * @property {string} geometry.type - Must be "Point".
 * @property {number[]} geometry.coordinates - [longitude, latitude] coordinates.
 * @property {Date} timestamp - Required observation timestamp; defaults to current time and is indexed.
 * @property {string} [rilev] - Additional reading or notes (TODO: refine structure).
 */
var meteoSchema = new Schema({
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
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

// Create a 2dsphere index for geospatial queries
meteoSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model("Meteo", meteoSchema, "meteo");