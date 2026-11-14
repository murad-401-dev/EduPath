const Program = require("../models/Program");

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
    if (subject) {
      filter.subject = { $regex: subject, $options: "i" };
    }
    if (maxTuition) {
      const max = Number(maxTuition);
      if (isNaN(max) || max < 0) {
        return res.status(400).json({ message: "Maximum tuition must be a positive number" });
      }
      filter.tuition = { $lte: max };
    }

    const programs = await Program.find(filter).sort({ tuition: 1 });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
}

module.exports = { getPrograms };
