const User = require("../models/User");
const Program = require("../models/Program");
const { expandSubject } = require("../utils/subjects");

function subjectMatches(user, program) {
  const programSubject = program.subject.toLowerCase();
  const wantedSubjects = expandSubject(user.preferredSubject);
  return wantedSubjects.some(
    (wanted) => programSubject.includes(wanted) || wanted.includes(programSubject)
  );
}

function calculateMatch(user, program) {
  let score = 0;
  const reasons = [];

  if (program.degree === user.preferredDegree) {
    score += 30;
    reasons.push("Degree matches your preference");
  }

  if (subjectMatches(user, program)) {
    score += 30;
    reasons.push("Subject matches your field of study");
  }

  if (user.preferredCountry && program.country.toLowerCase() === user.preferredCountry.toLowerCase()) {
    score += 20;
    reasons.push("Located in your preferred country");
  }

  if (user.budget === null || user.budget === undefined) {
    score += 10;
    reasons.push("No budget limit set");
  } else if (typeof program.tuition === "number" && program.tuition <= user.budget) {
    score += 10;
    reasons.push("Tuition is within your budget");
  }

  if (!program.minCgpa || (user.cgpa && user.cgpa >= program.minCgpa)) {
    score += 10;
    reasons.push("Your CGPA meets the minimum");
  }

  return { score, reasons };
}

async function getMatches(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.preferredDegree || !user.preferredSubject) {
      return res.status(400).json({ message: "Please set your study preferences first" });
    }

    const programs = await Program.find();

    const matches = programs
      .filter((program) => subjectMatches(user, program))
      .map((program) => {
        const { score, reasons } = calculateMatch(user, program);
        return { program, score, reasons };
      });

    matches.sort((a, b) => b.score - a.score);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
}

module.exports = { getMatches };
