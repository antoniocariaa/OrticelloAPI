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
 */
var lottoSchema = new Schema({
  dimensione: {
    type: Number,
    required: true
  },
  sensori: {
    type: Boolean,
    required: true
  }
});
module.exports = mongoose.model("Lotto", lottoSchema, "lotto");
