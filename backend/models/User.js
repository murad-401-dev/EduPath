const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    degree: { type: String },
    major: { type: String },
    university: { type: String },
    cgpa: { type: Number },
    graduationYear: { type: Number },
    ieltsScore: { type: Number },
    toeflScore: { type: Number },
    greScore: { type: Number },

    preferredCountry: { type: String },
    preferredDegree: { type: String },
    preferredSubject: { type: String },
    budget: { type: Number },
    intake: { type: String },
    researchInterest: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
