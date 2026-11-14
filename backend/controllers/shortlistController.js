const mongoose = require("mongoose");
const User = require("../models/User");
const Program = require("../models/Program");
const Scholarship = require("../models/Scholarship");

async function getShortlist(req, res) {
  try {
    const user = await User.findById(req.userId)
      .populate("shortlistedPrograms")
      .populate("shortlistedScholarships");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      programs: user.shortlistedPrograms,
      scholarships: user.shortlistedScholarships
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
}

async function addToShortlist(req, res) {
  try {
    const { itemType, itemId } = req.body || {};

    if (itemType !== "program" && itemType !== "scholarship") {
      return res.status(400).json({ message: "Item type must be program or scholarship" });
    }
    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ message: "Invalid item" });
    }

    const item = itemType === "program"
      ? await Program.findById(itemId)
      : await Scholarship.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const list = itemType === "program" ? user.shortlistedPrograms : user.shortlistedScholarships;
    if (list.some((id) => id.toString() === itemId)) {
      return res.status(400).json({ message: "Already in your shortlist" });
    }

    list.push(itemId);
    await user.save();
    res.json({ message: "Added to shortlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
}

async function removeFromShortlist(req, res) {
  try {
    const { itemType, itemId } = req.params;

    if (itemType !== "program" && itemType !== "scholarship") {
      return res.status(400).json({ message: "Item type must be program or scholarship" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (itemType === "program") {
      user.shortlistedPrograms = user.shortlistedPrograms.filter((id) => id.toString() !== itemId);
    } else {
      user.shortlistedScholarships = user.shortlistedScholarships.filter((id) => id.toString() !== itemId);
    }

    await user.save();
    res.json({ message: "Removed from shortlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
}

module.exports = { getShortlist, addToShortlist, removeFromShortlist };
