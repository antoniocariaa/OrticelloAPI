var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Sensor reading document stored via Mongoose.
 *
 * @typedef {Object} Sensor
 * @property {import('mongoose').Types.ObjectId} lotto Reference to the Lotto document (required).
 * @property {Object} geometry - GeoJSON geometry representing the sensor location (Point).
 * @property {string} geometry.type - Must be "Point".
 * @property {number[]} geometry.coordinates - [longitude, latitude] coordinates.
 * @property {Date} timestamp Reading timestamp (required, defaults to now, indexed).
 * @property {string} [rilev] Sensor payload (TODO: define structure).
 */
var sensorSchema = new Schema({
  lotto: {
    type: Schema.Types.ObjectId,
    ref: "Lotto",
    required: true
  },
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
  rilev: String // TO DO
});

// Create a 2dsphere index for geospatial queries
sensorSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model("Sensor", sensorSchema, "sensors");