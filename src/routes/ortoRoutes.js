const express = require("express");
const router = express.Router();
const ortoController = require("../controllers/ortoController");

router.get("/api/v1/orti", ortoController.getAllOrtos);

module.exports = router;