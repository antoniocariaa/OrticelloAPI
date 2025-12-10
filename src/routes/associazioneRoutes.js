const express = require("express");
const router = express.Router();
const associazioneController = require("../controllers/associazioneController");

router.get("/", associazioneController.getAllAssociazioni);
router.get("/:id", associazioneController.getAssociazioneById);
router.post("/", associazioneController.createAssociazione);
router.put("/:id", associazioneController.updateAssociazione);
router.delete("/:id", associazioneController.deleteAssociazione);

module.exports = router;