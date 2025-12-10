const express = require("express");
const router = express.Router();
const utenteController = require("../controllers/utenteController");

router.get("/", utenteController.getAllUtenti);
router.get("/:id", utenteController.getUtenteById);
// TO DO: Aggiungere rotte per creazione, aggiornamento e cancellazione utenti

module.exports = router;