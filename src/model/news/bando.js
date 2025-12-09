var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bandoSchema = new Schema({
  titolo: {
    type: String,
    required: true
  },
  data_inizio: {  
    type: Date,
    required: true
  },  
  data_fine: {  
    type: Date,
    required: true
  },
  messaggio: { 
    type: String, 
    required: true 
  },
  link:{
    type: String,
    required: false
  }
});

module.exports = mongoose.model("Bando", bandoSchema, "bando");