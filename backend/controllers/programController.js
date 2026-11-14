const Program = require("../models/Program");
const { subjectShortNames, expandSubject, escapeRegex } = require("../utils/subjects");

async function getPrograms(req, res) {
  try {
    const { country, degree, subject, maxTuition } = req.query;

    const filter = {};

    if (country) {
      filter.country = country;
    }
    if (degree) {
      filter.degree = degree;
    }
    if (subject && subject.trim()) {
      const terms = expandSubject(subject);
      filter.$or = [];
      terms.forEach((term) => {
        const pattern = { $regex: escapeRegex(term), $options: "i" };
        filter.$or.push({ subject: pattern }, { name: pattern });
      });
    }
    if (maxTuition) {
      const max = Number(maxTuition);
      if (isNaN(max) || max < 0) {
        return res.status(400).json({ message: "Maximum tuition must be a positive number" });
      }
      filter.tuition = { $lte: max };
    }

    const programs = await Program.find(filter).sort({ country: 1, name: 1 });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
}

async function getSubjects(req, res) {
  try {
    const programs = await Program.find({}, "subject name");

    const subjects = Object.keys(subjectShortNames).map((fullName) => {
      const term = fullName.toLowerCase();
      const count = programs.filter(
        (p) => p.subject.toLowerCase().includes(term) || p.name.toLowerCase().includes(term)
      ).length;
      return { name: fullName, shortNames: subjectShortNames[fullName], count };
    });

    res.json(subjects.filter((item) => item.count > 0));
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
}

module.exports = { getPrograms, getSubjects };
