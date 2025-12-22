var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Orto document schema.
 *
 * @typedef {Object} Orto
 * @property {string} nome - Required name of the garden.
 * @property {string} indirizzo - Required address of the garden.
 * @property {Object} geometry - GeoJSON geometry representing the garden area (Polygon).
 * @property {string} geometry.type - Must be "Polygon".
 * @property {number[][][]} geometry.coordinates - Array of linear rings (first is outer boundary, rest are holes).
 * @property {import('mongoose').Types.ObjectId[]} lotti - Array of ObjectId references to Lotto documents (ref: "Lotto").
 */
var ortoSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  indirizzo: {
    type: String,
    required: true
  },
  geometry: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true,
      default: 'Polygon'
    },
    coordinates: {
      type: [[[Number]]], // Array of linear rings
      required: true
    }
  },
  lotti: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lotto"
    }
  ]

});

// Create a 2dsphere index for geospatial queries
ortoSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model("Orto", ortoSchema);
