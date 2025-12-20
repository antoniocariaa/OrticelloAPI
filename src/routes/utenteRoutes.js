const express = require("express");
const router = express.Router();
const utenteController = require("../controllers/utenteController");
const checkToken = require("../util/checkToken");

router.post("/", utenteController.createUtente);

router.use(checkToken);

router.get("/", utenteController.getAllUtenti);
router.get("/:id", utenteController.getUtenteById);
router.put("/:id", utenteController.updateUtente);
router.delete("/:id", utenteController.deleteUtente);

router.put("/updatePassword/:id", utenteController.updatePassword);

module.exports = router;