const express = require("express");
const { getPrograms, getSubjects } = require("../controllers/programController");

const router = express.Router();

router.get("/", getPrograms);
router.get("/subjects", getSubjects);

module.exports = router;
