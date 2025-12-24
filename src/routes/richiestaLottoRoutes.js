const express = require("express");
const router = express.Router();
const richiestaLottoController = require("../controllers/richiestaLottoController");

router.get("/", richiestaLottoController.getAllRichiestaLotto);
router.post("/", richiestaLottoController.createRichiestaLotto);
router.get("/:id", richiestaLottoController.getRichiestaLottoById);
router.put("/:id", richiestaLottoController.updateRichiestaLotto);
router.delete("/:id", richiestaLottoController.deleteRichiestaLotto);

module.exports = router;
