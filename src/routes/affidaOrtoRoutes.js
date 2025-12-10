const express = require("express");
const router = express.Router();
const affidaOrtoController = require("../controllers/affidaOrtoController");

router.get("/", affidaOrtoController.getAllAffidaOrti);
router.post("/", affidaOrtoController.createAffidaOrto);
router.get("/:id", affidaOrtoController.getAffidaOrtoById);
router.put("/:id", affidaOrtoController.updateAffidaOrto);
router.delete("/:id", affidaOrtoController.deleteAffidaOrto);

module.exports = router;
