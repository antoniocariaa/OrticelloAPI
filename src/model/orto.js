var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Orto document schema.
 *
 * @typedef {Object} Orto
 * @property {string} nome - Required name of the garden.
 * @property {string} indirizzo - Required address of the garden.
 * @property {Object} coordinate - Required geographic coordinates.
 * @property {number} coordinate.lat - Latitude in decimal degrees.
 * @property {number} coordinate.lng - Longitude in decimal degrees.
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
  lotti: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lotto"
    }
  ]

});

module.exports = mongoose.model("Orto", ortoSchema);
