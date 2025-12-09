var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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