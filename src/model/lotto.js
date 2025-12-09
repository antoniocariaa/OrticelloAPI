var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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
