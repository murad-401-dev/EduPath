const User = require("../models/User");

async function updatePreferences(req, res) {
  try {
    const { preferredCountry, preferredDegree, preferredSubject, budget, intake, researchInterest } =
      req.body || {};

    if (!preferredCountry || !preferredDegree || !preferredSubject) {
      return res
        .status(400)
        .json({ message: "Preferred country, degree and subject are required" });
    }

    if (preferredDegree !== "MSc" && preferredDegree !== "PhD") {
      return res.status(400).json({ message: "Preferred degree must be MSc or PhD" });
    }

    let budgetNumber = null;
    if (budget !== undefined && budget !== null && budget !== "") {
      budgetNumber = Number(budget);
      if (isNaN(budgetNumber) || budgetNumber < 0) {
        return res.status(400).json({ message: "Budget must be a positive number" });
      }
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.preferredCountry = preferredCountry.trim();
    user.preferredDegree = preferredDegree;
    user.preferredSubject = preferredSubject.trim();
    user.budget = budgetNumber;
    user.intake = intake || "";
    user.researchInterest = researchInterest || "";
    await user.save();

    const updatedUser = await User.findById(req.userId).select("-password");
    res.json({ message: "Study preferences saved successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
}

module.exports = { updatePreferences };
