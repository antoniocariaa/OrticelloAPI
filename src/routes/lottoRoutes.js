const express = require("express");
const router = express.Router();
const lottoController = require("../controllers/lottoController");

router.get("/", lottoController.getAllLotti);
router.get("/", lottoController.createLotto);
router.get("/:id", lottoController.getLottoById);
router.get("/:id", lottoController.updateLotto);
router.get("/:id", lottoController.deleteLotto);

module.exports = router;