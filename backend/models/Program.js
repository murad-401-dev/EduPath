const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  university: { type: String, required: true },
  country: { type: String, required: true },
  degree: { type: String, required: true },
  subject: { type: String, required: true },
  tuition: { type: Number, required: true },
  duration: { type: String },
  applicationUrl: { type: String }
});

module.exports = mongoose.model("Program", programSchema);
