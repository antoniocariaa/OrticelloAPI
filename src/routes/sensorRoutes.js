const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/sensorController");

router.get("/", sensorController.getAllSensors);
router.get("/:id", sensorController.getSensorById);
// Implementazione specifiche per sensori
/*
    richiesta con limite di date
    richiesta per località geografica
    get last rilevazione sensore per la maggior parte delle richieste, sarà necessario implementarla per ottimizzare le performance
*/
module.exports = router;    

