const express = require("express");
const router = express.Router();
const ortoController = require("../controllers/ortoController");

router.get("/", ortoController.getAllOrtos);

module.exports = router;