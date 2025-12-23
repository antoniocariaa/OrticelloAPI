var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Mongoose schema for a "Lotto" document.
 *
 * Represents a plot with a size and whether it has sensors installed.
 *
 * @typedef {Object} Lotto
 * @property {number} dimensione - Size of the plot (e.g., in square meters). Required.
 * @property {boolean} sensori - Whether the plot is equipped with sensors. Required.
 * @property {Object} geometry - GeoJSON geometry representing the plot location (Point).
 * @property {string} geometry.type - Must be "Point".
 * @property {number[]} geometry.coordinates - [longitude, latitude] coordinates.
 */
var lottoSchema = new Schema({
  dimensione: {
    type: Number,
    required: true
  },
  sensori: {
    type: Boolean,
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
  }
});

// Create a 2dsphere index for geospatial queries
lottoSchema.index({ geometry: '2dsphere' });
module.exports = mongoose.model("Lotto", lottoSchema, "lotto");
