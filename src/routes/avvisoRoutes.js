const express = require("express");
const router = express.Router();
const avvisoController = require("../controllers/avvisoController");

router.get("/", avvisoController.getAllAvvisi);
router.post("/", avvisoController.createAvviso);
router.get("/:id", avvisoController.getAvvisoById);
router.put("/:id", avvisoController.updateAvviso);
router.delete("/:id", avvisoController.deleteAvviso);
module.exports = router;