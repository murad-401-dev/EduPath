const express = require("express");
const protect = require("../middleware/authMiddleware");
const { checkEligibility } = require("../controllers/eligibilityController");

const router = express.Router();

router.post("/:programId", protect, checkEligibility);

module.exports = router;
