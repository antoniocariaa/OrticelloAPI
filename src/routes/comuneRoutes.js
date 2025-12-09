const express = require("express");
const router = express.Router();
const comuneController = require("../controllers/comuneController");

router.get("/", comuneController.getAllComuni);
router.get("/:id", comuneController.getComuneById);
router.post("/", comuneController.createComune);
router.put("/:id", comuneController.updateComune);
router.delete("/:id", comuneController.deleteComune);

module.exports = router;