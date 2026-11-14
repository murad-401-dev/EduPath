const User = require("../models/User");

function toNumberOrNull(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  return Number(value);
}

async function updateAcademicInfo(req, res) {
  try {
    const { degree, major, university, cgpa, graduationYear, ieltsScore, toeflScore, greScore } =
      req.body || {};

    if (!degree || !major || !university || !cgpa || !graduationYear) {
      return res
        .status(400)
        .json({ message: "Degree, major, university, CGPA and graduation year are required" });
    }

    const cgpaNumber = Number(cgpa);
    if (isNaN(cgpaNumber) || cgpaNumber < 0 || cgpaNumber > 4) {
      return res.status(400).json({ message: "CGPA must be a number between 0 and 4" });
    }

    const year = Number(graduationYear);
    if (!Number.isInteger(year) || year < 1980 || year > 2035) {
      return res.status(400).json({ message: "Graduation year must be between 1980 and 2035" });
    }

    const ielts = toNumberOrNull(ieltsScore);
    if (ielts !== null && (isNaN(ielts) || ielts < 0 || ielts > 9)) {
      return res.status(400).json({ message: "IELTS score must be between 0 and 9" });
    }

    const toefl = toNumberOrNull(toeflScore);
    if (toefl !== null && (isNaN(toefl) || toefl < 0 || toefl > 120)) {
      return res.status(400).json({ message: "TOEFL score must be between 0 and 120" });
    }

    const gre = toNumberOrNull(greScore);
    if (gre !== null && (isNaN(gre) || gre < 260 || gre > 340)) {
      return res.status(400).json({ message: "GRE score must be between 260 and 340" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.degree = degree;
    user.major = major.trim();
    user.university = university.trim();
    user.cgpa = cgpaNumber;
    user.graduationYear = year;
    user.ieltsScore = ielts;
    user.toeflScore = toefl;
    user.greScore = gre;
    await user.save();

    const updatedUser = await User.findById(req.userId).select("-password");
    res.json({ message: "Academic information saved successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
}

module.exports = { updateAcademicInfo };
