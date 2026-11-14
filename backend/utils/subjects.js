const subjectShortNames = {
  "Computer Science": ["CS", "CSE", "Comp Sci", "Computing"],
  "Software Engineering": ["SWE", "SE", "Software"],
  "Artificial Intelligence": ["AI", "ML", "Machine Learning"],
  "Information Technology": ["IT"],
  "Web Engineering": ["Web", "Web Development"]
};

function expandSubject(text) {
  const typed = text.trim().toLowerCase();
  const terms = [];

  for (const fullName in subjectShortNames) {
    const shortNames = subjectShortNames[fullName].map((name) => name.toLowerCase());
    if (shortNames.includes(typed)) {
      terms.push(fullName.toLowerCase());
    }
  }

  if (terms.length === 0) {
    terms.push(typed);
  }
  return terms;
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = { subjectShortNames, expandSubject, escapeRegex };
