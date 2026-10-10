const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
} = require("../controllers/userController");
const { updateAcademicInfo } = require("../controllers/academicController");
const { updatePreferences } = require("../controllers/preferenceController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/academic", protect, updateAcademicInfo);
router.put("/preferences", protect, updatePreferences);

module.exports = router;
