const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getScholarships, checkScholarshipWithAI } = require("../controllers/scholarshipController");

const router = express.Router();

router.get("/", protect, getScholarships);
router.post("/:scholarshipId/ai-check", protect, checkScholarshipWithAI);

module.exports = router;
