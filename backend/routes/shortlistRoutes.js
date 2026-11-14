const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getShortlist,
  addToShortlist,
  removeFromShortlist
} = require("../controllers/shortlistController");

const router = express.Router();

router.get("/", protect, getShortlist);
router.post("/", protect, addToShortlist);
router.delete("/:itemType/:itemId", protect, removeFromShortlist);

module.exports = router;
