const express = require("express");
const router = express.Router();
const utenteController = require("../controllers/utenteController");
const checkToken = require("./checkToken");

router.post("/", utenteController.createUtente);

router.use(checkToken);

router.get("/", utenteController.getAllUtenti);
router.get("/:id", utenteController.getUtenteById);

// TO DO: Aggiungere rotte per creazione, aggiornamento e cancellazione utenti

module.exports = router;