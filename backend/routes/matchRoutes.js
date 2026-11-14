const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getMatches } = require("../controllers/matchController");

const router = express.Router();

router.get("/", protect, getMatches);

module.exports = router;
