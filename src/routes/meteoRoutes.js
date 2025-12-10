const express = require("express");
const router = express.Router();
const meteoController = require("../controllers/meteoController");

router.get("/", meteoController.getAllMeteo);
router.get("/:id", meteoController.getMeteoById);
// Implementazione specifiche per meteo
/*
    richiesta con limite di date
    richiesta per località geografica
    get last rilevazione meteo per la maggior parte delle richieste, sarà necessario implementarla per ottimizzare le performance
*/
module.exports = router;