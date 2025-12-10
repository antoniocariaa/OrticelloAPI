const express = require("express");
const router = express.Router();
const ortoController = require("../controllers/ortoController");

router.get("/", ortoController.getAllOrtos);
router.post("/", ortoController.createOrto);
router.get("/:id", ortoController.getOrtoById);
router.put("/:id", ortoController.updateOrto);
router.delete("/:id", ortoController.deleteOrto);


module.exports = router;