require("dotenv").config();
const mongoose = require("mongoose");
const Scholarship = require("./models/Scholarship");
const connectDB = require("./db");

const verifiedOn = new Date("2026-11-14");

const scholarships = [
  {
    name: "Chevening Scholarships",
    provider: "UK Government (FCDO)",
    country: "United Kingdom",
    degree: "MSc",
    eligibleCountries: ["Bangladesh"],
    workExperienceYears: 2,
    benefits: "Fully funded one-year master's degree at a UK university",
    requirements: [
      "Undergraduate degree completed at least two years before the application deadline",
      "At least two years of work experience (2,800 hours) after the undergraduate degree",
      "Apply to three eligible UK master's courses and receive an unconditional offer from one",
      "Return to your home country for at least two years after the scholarship"
    ],
    howToApply: "Apply online on the Chevening website",
    deadlineNote: "See the application timeline on the official website",
    officialUrl: "https://www.chevening.org/scholarships/who-can-apply/eligibility/",
    lastVerified: verifiedOn
  },
  {
    name: "Commonwealth Master's Scholarships",
    provider: "Commonwealth Scholarship Commission in the UK",
    country: "United Kingdom",
    degree: "MSc",
    eligibleCountries: ["Bangladesh"],
    benefits: "Full tuition fees, return airfare and a monthly stipend of GBP 1,712 (GBP 2,000 in London) for one-year master's programmes",
    requirements: [
      "Citizen of an eligible Commonwealth country (Bangladesh is eligible)",
      "First degree of at least upper second-class (2:1) honours, or lower second-class plus a relevant postgraduate qualification",
      "Taught master's programmes only (MBA is not funded)"
    ],
    howToApply: "Apply through a national nominating agency and the CSC online system (no direct applications)",
    deadlineNote: "2027/28 CSC deadline was 20 October 2026 (now closed). Check the next round on the official website",
    officialUrl: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/",
    lastVerified: verifiedOn
  },
  {
    name: "Fulbright Foreign Student Program (Bangladesh)",
    provider: "U.S. Department of State / U.S. Embassy Dhaka",
    country: "USA",
    degree: "MSc",
    eligibleCountries: ["Bangladesh"],
    workExperienceYears: 2,
    benefits: "Funding for graduate study in the United States",
    requirements: [
      "Four-year bachelor's degree with an outstanding academic record",
      "At least two years of full-time professional experience in the proposed field",
      "No foreign master's degree and no degree from a U.S. university",
      "Return home for at least two years after the program"
    ],
    howToApply: "Apply through the U.S. Embassy Dhaka call for applications",
    deadlineNote: "The 2027-28 call closed in July 2026. Check the U.S. Embassy Dhaka website for the next call",
    officialUrl: "https://bd.usembassy.gov/education-culture/fulbright-program/",
    lastVerified: verifiedOn
  },
  {
    name: "DAAD Scholarships (including EPOS)",
    provider: "German Academic Exchange Service (DAAD)",
    country: "Germany",
    degree: "Any",
    eligibleCountries: ["All"],
    benefits: "Monthly payment (examples: EUR 992 for master's students, EUR 1,300 for doctoral candidates; may change), travel allowance and usually health insurance",
    requirements: [
      "Requirements depend on the programme; read the call for applications",
      "Master's study scholarships for developing countries are offered through programmes such as EPOS",
      "Research grants for PhD candidates are open to applicants from almost all countries"
    ],
    howToApply: "Search the DAAD scholarship database and apply through the programme's portal",
    deadlineNote: "Each programme has its own deadline in the scholarship database",
    officialUrl: "https://www.daad.de/en/studying-in-germany/scholarships/daad-scholarships/",
    lastVerified: verifiedOn
  },
  {
    name: "Erasmus Mundus Joint Masters Scholarships",
    provider: "European Union (EACEA)",
    country: "Europe",
    degree: "MSc",
    eligibleCountries: ["All"],
    benefits: "Scholarships for outstanding students; coverage depends on the programme",
    requirements: [
      "Open to master's level students from all over the world",
      "Each programme sets its own entry requirements",
      "Not every programme offers scholarships"
    ],
    howToApply: "Apply directly to each Erasmus Mundus programme on its own website",
    deadlineNote: "Most programmes accept applications from October to January",
    officialUrl: "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en",
    lastVerified: verifiedOn
  },
  {
    name: "MEXT Research Student Scholarship (Embassy Recommendation)",
    provider: "Government of Japan (MEXT)",
    country: "Japan",
    degree: "Any",
    eligibleCountries: ["Bangladesh"],
    benefits: "Round-trip airfare between Bangladesh and Japan; entrance examination fees and tuition fees waived",
    requirements: [
      "Bangladeshi citizen",
      "Shortlisted by the Bangladesh Ministry of Education, then written exam and interview at the Embassy of Japan",
      "Age limit applies; see the current guidelines"
    ],
    howToApply: "Apply through the Ministry of Education call, then the Embassy of Japan screening",
    deadlineNote: "The 2026 round is closed. Check the Embassy of Japan in Bangladesh website for the next round",
    officialUrl: "https://www.bd.emb-japan.go.jp/en/education/scholarshipNotice.html",
    lastVerified: verifiedOn
  },
  {
    name: "Global Korea Scholarship (Graduate)",
    provider: "Government of Korea (NIIED)",
    country: "South Korea",
    degree: "Any",
    eligibleCountries: ["All"],
    minCgpa: 2.64,
    benefits: "Government scholarship for master's and doctoral study in Korea; see the official guidelines for benefits",
    requirements: [
      "CGPA of 80% or above (2.64 on a 4.0 scale), or ranked in the top 20% of your class",
      "Age and degree requirements apply; see the current guidelines"
    ],
    howToApply: "Apply through a Korean embassy or a Korean university as described in the guidelines",
    deadlineNote: "Guidelines are usually published in February. Check Study in Korea for the current round",
    officialUrl: "https://www.studyinkorea.go.kr/",
    lastVerified: verifiedOn
  },
  {
    name: "Australia Awards Scholarships (Bangladesh)",
    provider: "Australian Government (DFAT)",
    country: "Australia",
    degree: "MSc",
    eligibleCountries: ["Bangladesh"],
    benefits: "Master's study in Australia (coursework or research); see the official website for benefits",
    requirements: [
      "Bangladeshi citizen living in Bangladesh",
      "Master's by coursework or research only (no PhD)",
      "Not an Australia Awards recipient in the past four years",
      "Referee reports; research applicants also need a proposal and supervisor support"
    ],
    howToApply: "Apply online through the OASIS system before the closing date",
    deadlineNote: "Check the current intake on the Australia Awards Bangladesh website",
    officialUrl: "https://australiaawardsbangladesh.org/",
    lastVerified: verifiedOn
  },
  {
    name: "Türkiye Scholarships",
    provider: "Government of Türkiye",
    country: "Turkey",
    degree: "Any",
    eligibleCountries: ["All"],
    benefits: "University placement, monthly stipend, accommodation, health insurance, flight ticket and a Turkish language course",
    requirements: [
      "Competitive and merit-based",
      "Requirements and age limits are in the yearly call"
    ],
    howToApply: "Apply online for free on the Türkiye Scholarships website",
    deadlineNote: "See the application calendar on the official website",
    officialUrl: "https://www.turkiyeburslari.gov.tr/",
    lastVerified: verifiedOn
  }
];

async function seed() {
  try {
    await connectDB();
    await Scholarship.deleteMany({});
    await Scholarship.insertMany(scholarships);
    console.log(`Added ${scholarships.length} verified scholarships`);
  } catch (error) {
    console.log("Seeding failed:", error.message);
  }
  await mongoose.disconnect();
}

seed();
