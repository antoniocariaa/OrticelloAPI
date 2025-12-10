const express = require("express");
const router = express.Router();
const affidaLottoController = require("../controllers/affidaLottoController");

router.get("/", affidaLottoController.getAllAffidaLotti);
router.post("/", affidaLottoController.createAffidaLotto);
router.get("/:id", affidaLottoController.getAffidaLottoById);
router.put("/:id", affidaLottoController.updateAffidaLotto);
router.delete("/:id", affidaLottoController.deleteAffidaLotto);

// --- NUOVE ROTTE ---
router.post("/api/v1/affida-lotti/:id/colture", affidaLottoController.addColtura);
router.delete("/api/v1/affida-lotti/:id/colture/:coltura", affidaLottoController.removeColtura);

module.exports = router;
