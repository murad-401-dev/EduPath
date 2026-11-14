const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider: { type: String, required: true },
  country: { type: String, required: true },
  degree: { type: String, required: true },
  subject: { type: String, default: "Any" },
  eligibleCountries: [{ type: String }],
  minCgpa: { type: Number },
  minIelts: { type: Number },
  workExperienceYears: { type: Number },
  benefits: { type: String, required: true },
  requirements: [{ type: String }],
  howToApply: { type: String },
  deadlineNote: { type: String },
  officialUrl: { type: String, required: true },
  lastVerified: { type: Date, required: true }
});

module.exports = mongoose.model("Scholarship", scholarshipSchema);
