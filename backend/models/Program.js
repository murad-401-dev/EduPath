const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  university: { type: String, required: true },
  country: { type: String, required: true },
  degree: { type: String, required: true },
  subject: { type: String, required: true },
  tuition: { type: Number },
  tuitionNote: { type: String },
  duration: { type: String },
  applicationUrl: { type: String, required: true },
  minCgpa: { type: Number },
  minIelts: { type: Number },
  requirements: { type: String },
  lastVerified: { type: Date, required: true }
});

module.exports = mongoose.model("Program", programSchema);
