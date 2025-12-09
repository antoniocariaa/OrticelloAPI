const mongoose = require("mongoose");
const { Schema } = mongoose;

const associazioneSchema = new Schema({
  nome: { type: String, required: true, trim: true },
  indirizzo: { type: String, required: true, trim: true },
  telefono: {
    type: String,
    required: true,
    validate:{
        validator: function(v){
            return validator.isMobilePhone(v);
        },
        message: '{VALUE} non è un numero di telefono valido'
    } 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
        validator: function(v) {
        return validator.isEmail(v);
        },
        message: '{VALUE} non è un\'email valida'
    }
  },
}, { timestamps: true });

module.exports = mongoose.model("Associazione", associazioneSchema, "associazione");
