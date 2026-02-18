var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var avvisoSchema = new Schema({
  titolo: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['asso', 'comu'],
    default: 'asso'           
  },
  comune: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comune',
    required: function () {
        return this.tipo === 'comu';    
    }
  },
  associazione: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Associazione',
    required: function () {
        return this.tipo === 'asso';    
    }
  },
  data: {  
    type: Date,
    required: true
  },
  target: {
    type: String,
    enum: ['asso', 'all'],
    default: 'all',
    required: function () {
        return this.tipo === 'comu';    
    }
  },
  messaggio: { 
    type: String, 
    required: true 
  },
  categoria:{
    type: String,
    required: false
  }

});

module.exports = mongoose.model("Avviso", avvisoSchema, "avviso");