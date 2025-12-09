const express = require("express");
const router = express.Router();
const lottoController = require("../controllers/lottoController");

router.get("/api/v1/lotti", lottoController.getAllLotti);
router.get("/api/v1/lotti", lottoController.createLotto);
router.get("/api/v1/lotti", lottoController.getLottoById);
router.get("/api/v1/lotti", lottoController.updateLotto);
router.get("/api/v1/lotti", lottoController.deleteLotto);

module.exports = router;