const express = require("express");
const router = express.Router();
const bandoController = require("../controllers/bandoController");

router.get("/", bandoController.getAllBandi);
router.post("/", bandoController.createBando);
router.get("/:id", bandoController.getBandoById);
router.put("/:id", bandoController.updateBando);
router.delete("/:id", bandoController.deleteBando);

module.exports = router;