const express = require("express");
const { getPrograms } = require("../controllers/programController");

const router = express.Router();

router.get("/", getPrograms);

module.exports = router;
