var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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
