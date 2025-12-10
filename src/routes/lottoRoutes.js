const express = require("express");
const router = express.Router();
const lottoController = require("../controllers/lottoController");

router.get("/", lottoController.getAllLotti);
router.post("/", lottoController.createLotto);
router.get("/:id", lottoController.getLottoById);
router.put("/:id", lottoController.updateLotto);
router.delete("/:id", lottoController.deleteLotto);

module.exports = router;