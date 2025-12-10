const express = require("express");
const router = express.Router();
const affidaLottoController = require("../controllers/affidaLottoController");

router.get("/", affidaLottoController.getAllAffidaLotti);
router.post("/", affidaLottoController.createAffidaLotto);
router.get("/:id", affidaLottoController.getAffidaLottoById);
router.put("/:id", affidaLottoController.updateAffidaLotto);
router.delete("/:id", affidaLottoController.deleteAffidaLotto);

// --- NUOVE ROTTE ---
router.post("/api/v1/affida-lotti/:id/culture", affidaLottoController.addCultura);
router.delete("/api/v1/affida-lotti/:id/culture/:cultura", affidaLottoController.removeCultura);

module.exports = router;
