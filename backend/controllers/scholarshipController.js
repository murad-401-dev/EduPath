const mongoose = require("mongoose");
const User = require("../models/User");
const Scholarship = require("../models/Scholarship");
const { askGemini } = require("../utils/gemini");

const aiResultSchema = {
  type: "OBJECT",
  properties: {
    status: { type: "STRING", enum: ["Eligible", "Partially Eligible", "Not Eligible"] },
    matchedRequirements: { type: "ARRAY", items: { type: "STRING" } },
    missingRequirements: { type: "ARRAY", items: { type: "STRING" } },
    toVerify: { type: "ARRAY", items: { type: "STRING" } },
    summary: { type: "STRING" }
  },
  required: ["status", "matchedRequirements", "missingRequirements", "toVerify", "summary"]
};

function buildScholarshipPrompt(user, scholarship) {
  const today = new Date().toISOString().slice(0, 10);
  return `You are checking if a student can apply for a scholarship. Today is ${today}.

Student profile:
- Applying from: Bangladesh (EduPath is for Bangladeshi students)
- Completed degree: ${user.degree} in ${user.major}
- University: ${user.university}
- CGPA: ${user.cgpa} out of 4.00
- Graduation year: ${user.graduationYear}
- IELTS: ${user.ieltsScore ?? "not given"}
- TOEFL iBT: ${user.toeflScore ?? "not given"}
- GRE: ${user.greScore ?? "not given"}
- Wants to study: ${user.preferredDegree || "not set"} in ${user.preferredSubject || "not set"}
- Preferred country: ${user.preferredCountry || "not set"}
- Work experience: not recorded in the profile

Scholarship: ${scholarship.name} (${scholarship.provider})
- Study in: ${scholarship.country}
- Degree level: ${scholarship.degree === "Any" ? "MSc and PhD" : scholarship.degree}
- Open to citizens of: ${scholarship.eligibleCountries.join(", ") || "not specified"}
- Minimum CGPA: ${scholarship.minCgpa ?? "not specified"}
- Minimum IELTS: ${scholarship.minIelts ?? "not specified"}
- Work experience: ${scholarship.workExperienceYears ? scholarship.workExperienceYears + " years" : "not specified"}
- Requirements: ${scholarship.requirements.join("; ")}
- Deadline: ${scholarship.deadlineNote || "not specified"}

Rules:
- Use only the information above. Do not invent requirements.
- If something needed is not in the student profile (for example work experience or age), put it in toVerify, not in missingRequirements.
- When a requirement has alternatives (for example "CGPA X or top 20% of the class"), it is clearly not met only if every alternative fails; if an alternative cannot be checked, put it in toVerify.
- "Not Eligible" only when a requirement is clearly not met. "Partially Eligible" when nothing clearly fails but important items need checking. "Eligible" when the known requirements are met.
- If the deadline has passed or the round is closed, say so in the summary.
- Keep each list item short. The summary is one or two sentences.`;
}

function checkScholarship(user, scholarship) {
  const missing = [];
  const toConfirm = [];

  if (scholarship.degree !== "Any") {
    if (!user.preferredDegree) {
      missing.push("Set your preferred degree in Study Preferences");
    } else if (user.preferredDegree !== scholarship.degree) {
      missing.push("Only for " + scholarship.degree + " study");
    }
  }

  if (scholarship.minCgpa) {
    if (!user.cgpa) {
      missing.push("Add your academic information (CGPA)");
    } else if (user.cgpa < scholarship.minCgpa) {
      missing.push("CGPA " + scholarship.minCgpa.toFixed(2) + " or higher");
    }
  }

  if (scholarship.minIelts) {
    if (!user.ieltsScore || user.ieltsScore < scholarship.minIelts) {
      missing.push("IELTS " + scholarship.minIelts + " or higher");
    }
  }

  if (scholarship.subject !== "Any") {
    const field = (user.preferredSubject || user.major || "").toLowerCase();
    const required = scholarship.subject.toLowerCase();
    if (!field || !(field.includes(required) || required.includes(field))) {
      missing.push("Field of study must be " + scholarship.subject);
    }
  }

  scholarship.requirements.forEach((requirement) => toConfirm.push(requirement));

  const eligible = missing.length === 0;
  return {
    eligible,
    status: eligible ? "Likely eligible" : "Not eligible",
    missing,
    toConfirm
  };
}

async function getScholarships(req, res) {
  try {
    const { country, degree } = req.query;

    const filter = {};
    if (country) {
      filter.country = country;
    }
    if (degree) {
      filter.degree = { $in: [degree, "Any"] };
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const scholarships = await Scholarship.find(filter).sort({ name: 1 });

    const results = scholarships.map((scholarship) => {
      const check = checkScholarship(user, scholarship);
      return { scholarship, ...check };
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
}

async function checkScholarshipWithAI(req, res) {
  try {
    const { scholarshipId } = req.params;
    if (!mongoose.isValidObjectId(scholarshipId)) {
      return res.status(400).json({ message: "Invalid scholarship" });
    }

    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
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
      result = await askGemini(buildScholarshipPrompt(user, scholarship), aiResultSchema);
    } catch (error) {
      console.log("Gemini error:", error.message);
      return res.status(502).json({ message: "Could not get a result from the AI service. Please try again." });
    }

    res.json({
      scholarshipId: scholarship._id,
      status: result.status,
      matchedRequirements: result.matchedRequirements,
      missingRequirements: result.missingRequirements,
      toVerify: result.toVerify,
      summary: result.summary
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
}

module.exports = { getScholarships, checkScholarshipWithAI };
