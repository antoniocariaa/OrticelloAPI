const mongoose = require("mongoose");
const { Schema } = mongoose;

const comuneSchema = new Schema({
  nome: { type: String, required: true, trim: true },
  indirizzo: { type: String, required: true, trim: true },
  telefono: { type: String, required: true, trim: true },
  mail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Formato email non valido"]
  }
}, { timestamps: true });

module.exports = mongoose.model("Comune", comuneSchema, "comune");
