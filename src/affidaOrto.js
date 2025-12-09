const mongoose = require("mongoose");
const { Schema } = mongoose;

const affidaOrto = new Schema({
  orto: {
    type: Schema.Types.ObjectId,
    ref: "Orto",
    required: true
  },
  associazione: {
    type: Schema.Types.ObjectId,
    ref: "Associazione",
    required: true
  },
  data_inizio: {
    type: Date,
    required: true
  },
  data_fine: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("AffidaOrto", affidaOrto, "affidaOrto");
