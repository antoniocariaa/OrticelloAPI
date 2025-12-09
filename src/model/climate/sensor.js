var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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