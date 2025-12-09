const mongoose = require("mongoose");
const { Schema } = mongoose;

const affidaLotto = new Schema({

    lotto: {
        type: Schema.Types.ObjectId,
        ref: "Lotto",
        required: true
    },
    utente: {
        type: Schema.Types.ObjectId,
        ref: "Utente",
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
    culture:[String]

}, { timestamps: true });

module.exports = mongoose.model("AffidaLotto", affidaLotto, "affidaLotto");
