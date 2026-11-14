const mongoose = require("mongoose");
const User = require("../models/User");
const Program = require("../models/Program");
const { askGemini } = require("../utils/gemini");

function buildPrompt(user, program) {
  return `You are checking if a student meets the admission requirements of a graduate program.

Student academic information:
- Degree: ${user.degree} in ${user.major}
- University: ${user.university}
- CGPA: ${user.cgpa} out of 4.00
- Graduation year: ${user.graduationYear}
- IELTS: ${user.ieltsScore ?? "not given"}
- TOEFL iBT: ${user.toeflScore ?? "not given"}
- GRE: ${user.greScore ?? "not given"}

Program: ${program.name}, ${program.university}
Program requirements:
- Minimum CGPA: ${program.minCgpa ?? "not specified"}
- Minimum IELTS: ${program.minIelts ?? "not required"}
- Other requirements: ${program.requirements || "not specified"}

Compare the student with the requirements. Reply only with JSON in this format:
{"status": "Eligible" or "Partially Eligible" or "Not Eligible",
 "matchedRequirements": ["..."],
 "missingRequirements": ["..."],
 "summary": "one or two short sentences"}`;
}

async function checkEligibility(req, res) {
  try {
    const { programId } = req.params;
    if (!mongoose.isValidObjectId(programId)) {
      return res.status(400).json({ message: "Invalid program" });
    }

    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.degree || !user.cgpa) {
      return res.status(400).json({ message: "Please add your academic information first" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API key is not set on the server" });
    }

    let result;
    try {
      result = await askGemini(buildPrompt(user, program));
    } catch (error) {
      console.log("Gemini error:", error.message);
      return res.status(502).json({ message: "Could not get a result from the AI service. Please try again." });
    }

    res.json({
      program: { id: program._id, name: program.name, university: program.university },
      status: result.status || "Not Eligible",
      matchedRequirements: result.matchedRequirements || [],
      missingRequirements: result.missingRequirements || [],
      summary: result.summary || ""
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
}

module.exports = { checkEligibility };
