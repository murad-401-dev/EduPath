require("dotenv").config();
const mongoose = require("mongoose");
const Program = require("./models/Program");
const connectDB = require("./db");

const verifiedOn = new Date("2026-11-14");

const programs = [
  {
    name: "MS in Computer Science",
    university: "The University of Texas at Dallas",
    country: "USA",
    degree: "MSc",
    subject: "Computer Science",
    tuitionNote: "Not published as a yearly amount. Use the UT Dallas Bursar tuition estimate calculator",
    duration: "33 credit hours",
    applicationUrl: "https://catalog.utdallas.edu/2026/graduate/programs/ecs/computer-science",
    minCgpa: 3.0,
    requirements: "GPA of at least 3.0 in the last 60 credit hours and at least 3.3 in quantitative courses; two semesters of calculus, one semester of linear algebra and a strong programming foundation; TOEFL iBT 80 or higher; GRE optional; one letter of recommendation and a statement of purpose",
    lastVerified: verifiedOn
  },
  {
    name: "PhD in Computer Science",
    university: "The University of Texas at Dallas",
    country: "USA",
    degree: "PhD",
    subject: "Computer Science",
    tuitionNote: "Not published as a yearly amount. Use the UT Dallas Bursar tuition estimate calculator",
    duration: "75 credit hours beyond the bachelor's degree",
    applicationUrl: "https://catalog.utdallas.edu/2026/graduate/programs/ecs/computer-science",
    minCgpa: 3.5,
    requirements: "Master's degree in computer science with GPA of at least 3.5, or a related BS with calculus and linear algebra and GPA of at least 3.5 in the last 60 credit hours; GRE optional; three letters of recommendation and a statement of purpose",
    lastVerified: verifiedOn
  },
  {
    name: "MSc in Computer Science (Thesis)",
    university: "University of Saskatchewan",
    country: "Canada",
    degree: "MSc",
    subject: "Computer Science",
    tuition: 9200,
    tuitionNote: "CAD 12,837 per year for international students (2026-27)",
    applicationUrl: "https://programs.usask.ca/grad-studies/computer-science/comp-sci-msc-thesis.php",
    minIelts: 7.0,
    requirements: "Four-year honours degree in a relevant discipline with a weighted average of at least 70% in the last two years; IELTS 7.0 with no band below 6.5, or TOEFL 94 with no section below 20",
    lastVerified: verifiedOn
  },
  {
    name: "PhD in Computer Science",
    university: "University of Saskatchewan",
    country: "Canada",
    degree: "PhD",
    subject: "Computer Science",
    tuition: 4100,
    tuitionNote: "CAD 5,637 per year (2026-27); international PhD students pay the domestic rate",
    applicationUrl: "https://programs.usask.ca/grad-studies/computer-science/comp-sci-phd.php",
    minIelts: 7.0,
    requirements: "Master's degree in a relevant discipline with a weighted average of at least 70% in the last two years; IELTS 7.0 with no band below 6.5, or TOEFL 94 with no section below 20",
    lastVerified: verifiedOn
  },
  {
    name: "Master of Computer Science (MCompSc, Thesis)",
    university: "Concordia University",
    country: "Canada",
    degree: "MSc",
    subject: "Computer Science",
    tuitionNote: "Depends on student status. Use the Concordia tuition and fee estimator",
    duration: "2 years (45 credits)",
    applicationUrl: "https://www.concordia.ca/academics/graduate/computer-science-mcompsc.html",
    requirements: "Bachelor's degree in computer science or a related field (engineering, science or mathematics) with very high standing; proof of English proficiency; international deadline 1 March for Fall",
    lastVerified: verifiedOn
  },
  {
    name: "Computing Science MSc",
    university: "University of Glasgow",
    country: "United Kingdom",
    degree: "MSc",
    subject: "Computer Science",
    tuition: 46300,
    tuitionNote: "GBP 34,815 for international students (2027-28)",
    duration: "12 months",
    applicationUrl: "https://www.gla.ac.uk/postgraduate/taught/computingscience/",
    minIelts: 6.5,
    requirements: "2:1 honours degree (or equivalent) with Computing as a major subject, at least 50% of modules in Computing or Advanced Programming; IELTS Academic 6.5 overall",
    lastVerified: verifiedOn
  },
  {
    name: "Advanced Computer Science MSc",
    university: "University of Leeds",
    country: "United Kingdom",
    degree: "MSc",
    subject: "Computer Science",
    tuition: 46000,
    tuitionNote: "GBP 34,600 total for international students (2027 entry)",
    duration: "12 months",
    applicationUrl: "https://courses.leeds.ac.uk/f753/advanced-computer-science-msc",
    minIelts: 6.5,
    requirements: "Bachelor's degree with a 2:1 (hons) in computer science; IELTS 6.5 overall with no less than 6.0 in any component",
    lastVerified: verifiedOn
  },
  {
    name: "Computer Science with Software Engineering MSc",
    university: "University of Leeds",
    country: "United Kingdom",
    degree: "MSc",
    subject: "Software Engineering",
    tuition: 46000,
    tuitionNote: "GBP 34,600 total for international students (2027 entry)",
    duration: "12 months",
    applicationUrl: "https://courses.leeds.ac.uk/k301/computer-science-with-software-engineering-msc",
    minIelts: 6.5,
    requirements: "Bachelor's degree with a 2:1 (hons) in a subject other than computer science; mathematical competence; IELTS 6.5 overall with no less than 6.0 in any component",
    lastVerified: verifiedOn
  },
  {
    name: "MSc Computer Science",
    university: "University of Passau",
    country: "Germany",
    degree: "MSc",
    subject: "Computer Science",
    tuition: 0,
    tuitionNote: "No tuition fees; semester contribution of about EUR 130",
    duration: "4 semesters",
    applicationUrl: "https://www.uni-passau.de/en/msc-computer-science/",
    minIelts: 5.5,
    requirements: "Bachelor's degree in computer science or a related discipline with at least 110 ECTS of computer science; within the best 70% of the cohort or German grade 2.7 or better; English B2 (IELTS Academic 5.5); deadline 31 May for winter semester",
    lastVerified: verifiedOn
  },
  {
    name: "Web Engineering (M.Sc.)",
    university: "Chemnitz University of Technology",
    country: "Germany",
    degree: "MSc",
    subject: "Web Engineering (Computer Science)",
    tuitionNote: "Not stated on the programme page. Check the official website",
    duration: "4 semesters",
    applicationUrl: "https://tu-chemnitz.de/informatik/studium/studiengaenge/ma_web_engineering.php.en",
    requirements: "Bachelor's degree in Computer Science or Applied Computer Science, or an equivalent programme; English at CEFR level B2; international applications are checked by uni-assist",
    lastVerified: verifiedOn
  },
  {
    name: "Master's Program, Graduate School of Information Science and Technology (English Program)",
    university: "The University of Tokyo",
    country: "Japan",
    degree: "MSc",
    subject: "Computer Science",
    tuition: 3600,
    tuitionNote: "JPY 535,800 per year plus JPY 282,000 admission fee",
    duration: "2 years",
    applicationUrl: "https://www.i.u-tokyo.ac.jp/ist_en/en-course/register_e.shtml",
    requirements: "Pass the regular master's entrance examination; English ability is assessed from submitted TOEFL scores",
    lastVerified: verifiedOn
  },
  {
    name: "Master's in Computer Science (School of Computing)",
    university: "KAIST",
    country: "South Korea",
    degree: "MSc",
    subject: "Computer Science",
    tuitionNote: "See Cost of Studying at KAIST; the KAIST Scholarship can cover full tuition for 4 semesters",
    duration: "2 years",
    applicationUrl: "https://admission.kaist.ac.kr/intl-graduate/Admission/Eligibility",
    minIelts: 6.5,
    requirements: "Non-Korean citizen with a bachelor's degree by the start of the course; IELTS Academic 6.5 or TOEFL iBT 83 (tests before 21 Jan 2026); English medium of instruction exemption possible for some countries",
    lastVerified: verifiedOn
  },
  {
    name: "Master of Computer Science (Research)",
    university: "Universiti Malaya",
    country: "Malaysia",
    degree: "MSc",
    subject: "Computer Science",
    tuitionNote: "MYR 43,200 for the full-time programme for international students (excluding 6% SST)",
    duration: "4 semesters",
    applicationUrl: "https://study.um.edu.my/master-of-computer-science-research",
    minCgpa: 3.0,
    minIelts: 6.0,
    requirements: "Bachelor's degree with CGPA of at least 3.00; CGPA 2.50 to 2.99 is accepted with an extra condition such as one year of related work experience or publications; IELTS Academic 6.0 or TOEFL iBT 60",
    lastVerified: verifiedOn
  },
  {
    name: "Master of Information Technology",
    university: "UNSW Sydney",
    country: "Australia",
    degree: "MSc",
    subject: "Information Technology",
    tuitionNote: "International fee is in the UNSW international fee schedule. Check the official website",
    duration: "2 years",
    applicationUrl: "https://www.unsw.edu.au/study/postgraduate/master-of-information-technology",
    requirements: "Bachelor's degree in a related discipline with a weighted average mark of at least 65%, or any 3-year bachelor's degree with a 65% average through the Graduate Certificate pathway; English requirements are program specific",
    lastVerified: verifiedOn
  },
  {
    name: "Computer Science, MS",
    university: "Arizona State University",
    country: "USA",
    degree: "MSc",
    subject: "Computer Science",
    tuitionNote: "Not stated on the program page. Use the ASU tuition estimator",
    duration: "30 credit hours",
    applicationUrl: "https://degrees.asu.edu/masters-phd/major/ASU00/ESCOMSCMS/computer-science-ms",
    minCgpa: 3.25,
    minIelts: 7.0,
    requirements: "Bachelor's or master's degree in computer science, computer engineering or a closely related area; GPA of at least 3.25 in the last 60 hours; two semesters of calculus; TOEFL 90 or IELTS 7 (2025-26 MS CS handbook); priority deadline 1 December for Fall",
    lastVerified: verifiedOn
  },
  {
    name: "Computer Science and Engineering MS",
    university: "University at Buffalo (SUNY)",
    country: "USA",
    degree: "MSc",
    subject: "Computer Science",
    tuitionNote: "Not stated on the program page. Check the University at Buffalo tuition page",
    duration: "30 credit hours (1.5 to 2 years)",
    applicationUrl: "https://engineering.buffalo.edu/computer-science-engineering/graduate/admissions/faq.html",
    minCgpa: 3.0,
    minIelts: 6.5,
    requirements: "Bachelor's degree with programming, computer organization, data structures and four semesters of math or logic; GPA above 3.0 expected (no strict minimum, admitted average about 3.4); TOEFL iBT 79 or IELTS 6.5; GRE optional; one letter of recommendation; Fall deadline 31 December",
    lastVerified: verifiedOn
  },
  {
    name: "MS in Computer Science",
    university: "Northeastern University (Khoury College)",
    country: "USA",
    degree: "MSc",
    subject: "Computer Science",
    tuitionNote: "USD 1,922 per credit hour (2026-27)",
    applicationUrl: "https://www.khoury.northeastern.edu/apply/masters-apply/",
    minCgpa: 3.0,
    minIelts: 6.5,
    requirements: "GPA of at least 3.0 on a 4.0 scale (or 80 on a 100 scale); TOEFL 90 or IELTS 6.5 recommended; GRE optional; Fall 2027 deadline for international applicants outside the US is 15 June",
    lastVerified: verifiedOn
  },
  {
    name: "Advanced Computer Science MSc",
    university: "University of Nottingham",
    country: "United Kingdom",
    degree: "MSc",
    subject: "Computer Science",
    tuition: 46300,
    tuitionNote: "GBP 34,800 for international students (2027 entry)",
    duration: "12 months",
    applicationUrl: "https://www.nottingham.ac.uk/pgstudy/course/taught/computer-science-artificial-intelligence",
    minIelts: 6.5,
    requirements: "2:1 (or international equivalent) in Computer Science, or a STEM or numerate discipline with substantial computing content; IELTS 6.5 with at least 6.0 in each component",
    lastVerified: verifiedOn
  },
  {
    name: "MSc Advanced Computer Science",
    university: "The University of Manchester",
    country: "United Kingdom",
    degree: "MSc",
    subject: "Computer Science",
    tuition: 55100,
    tuitionNote: "GBP 41,400 per year for international students (2027 entry)",
    duration: "12 months",
    applicationUrl: "https://www.manchester.ac.uk/study/masters/courses/list/21573/msc-advanced-computer-science/",
    minIelts: 7.0,
    requirements: "Typically a First-class honours degree (70% average) or overseas equivalent in Computer Science with at least 50% Computer Science content; IELTS 7.0 with no subskill below 6.5",
    lastVerified: verifiedOn
  },
  {
    name: "MSc Software Engineering",
    university: "The University of Manchester",
    country: "United Kingdom",
    degree: "MSc",
    subject: "Software Engineering",
    tuition: 55100,
    tuitionNote: "GBP 41,400 per year for international students (2027 entry)",
    duration: "12 months",
    applicationUrl: "https://www.manchester.ac.uk/study/masters/courses/list/21577/msc-software-engineering/",
    minIelts: 7.0,
    requirements: "Typically a First-class honours degree (70% average) in Computer Science with at least 50% Computer Science content; IELTS 7.0 with no subskill below 6.5",
    lastVerified: verifiedOn
  },
  {
    name: "Artificial Intelligence MSc",
    university: "The University of Edinburgh",
    country: "United Kingdom",
    degree: "MSc",
    subject: "Artificial Intelligence (Computer Science)",
    tuitionNote: "Listed on the 2027 fee pages linked from the programme page",
    duration: "1 year",
    applicationUrl: "https://study.ed.ac.uk/postgraduate/degrees/index.php?r=site/view&id=107",
    minIelts: 7.0,
    requirements: "UK 2:1 honours degree or international equivalent in informatics, AI, computer science, mathematics or a related subject; programming competence; mathematics including calculus, linear algebra, discrete maths and probability; IELTS 7.0 with at least 6.5 in three components and 6.0 in the other",
    lastVerified: verifiedOn
  },
  {
    name: "Advanced Computer Science MSc",
    university: "The University of Sheffield",
    country: "United Kingdom",
    degree: "MSc",
    subject: "Computer Science",
    tuitionNote: "Use the fee lookup on the official course page",
    duration: "1 year",
    applicationUrl: "https://www.sheffield.ac.uk/postgraduate/taught/courses/2027/advanced-computer-science-msc",
    minIelts: 6.5,
    requirements: "Minimum 2:1 undergraduate honours degree in a relevant subject; IELTS 6.5 with 6 in each component",
    lastVerified: verifiedOn
  },
  {
    name: "Advanced Computer Science MSc",
    university: "University of Birmingham",
    country: "United Kingdom",
    degree: "MSc",
    subject: "Computer Science",
    tuitionNote: "International fee is shown by country on the official course page",
    duration: "1 year",
    applicationUrl: "https://www.birmingham.ac.uk/postgraduate/courses/taught/computer-science/advanced-computer-science",
    minIelts: 6.5,
    requirements: "2:1 honours degree in Computing or a closely related discipline with a solid foundation in programming and algorithms; IELTS 6.5 with no less than 6.0 in any band",
    lastVerified: verifiedOn
  },
  {
    name: "Computer Science, Master of Science (Technology)",
    university: "Aalto University",
    country: "Finland",
    degree: "MSc",
    subject: "Computer Science",
    tuition: 19600,
    tuitionNote: "EUR 17,000 per year for non-EU/EEA students",
    duration: "2 years (120 ECTS)",
    applicationUrl: "https://www.aalto.fi/en/study-options/masters-programme-in-computer-communication-and-information-sciences-computer-science",
    minIelts: 6.5,
    requirements: "Relevant bachelor's degree with excellent grades (past example for India: 8.0/10 or 75%); university courses in mathematics, programming, algorithms, databases, operating systems, networks and software engineering; motivation letter and CV; IELTS Academic 6.5 with writing 6.0; application period 7 Dec 2026 to 5 Jan 2027",
    lastVerified: verifiedOn
  },
  {
    name: "MSc Computer Science",
    university: "Delft University of Technology (TU Delft)",
    country: "Netherlands",
    degree: "MSc",
    subject: "Computer Science",
    tuition: 30500,
    tuitionNote: "EUR 26,479 institutional rate for non-EU students (2027/2028)",
    duration: "2 years",
    applicationUrl: "https://www.tudelft.nl/en/education/programmes/masters/cs/msc-computer-science/admission-and-application/non-eu-efta-applicants-with-an-international-bachelor-degree",
    requirements: "Engineering bachelor's degree in Computer Science or a closely related field with good scores in key subjects; GRE General Test required; English test as per TU Delft general requirements; deadline 15 January; ranked batch admission",
    lastVerified: verifiedOn
  },
  {
    name: "Master's programme in Computer Science",
    university: "KTH Royal Institute of Technology",
    country: "Sweden",
    degree: "MSc",
    subject: "Computer Science",
    tuitionNote: "SEK 385,000 in total for most two-year programmes (varies by programme); application fee SEK 900",
    duration: "2 years (120 ECTS)",
    applicationUrl: "https://www.kth.se/en/studies/master/computer-science/msc-computer-science-1.419974",
    requirements: "Bachelor's degree with the programme's specific entry requirements; English proficiency; apply 16 Oct 2026 to 15 Jan 2027 for August 2027 start; KTH Scholarship can cover full tuition",
    lastVerified: verifiedOn
  },
  {
    name: "Computer Science and Engineering (Master of Science)",
    university: "Politecnico di Milano",
    country: "Italy",
    degree: "MSc",
    subject: "Computer Science",
    tuition: 4500,
    tuitionNote: "Up to EUR 3,943.04 per year (2026/27); non-EU students with a foreign degree and no scholarship pay the maximum",
    duration: "2 years (120 credits)",
    applicationUrl: "https://www.polimi.it/en/education/laurea-magistrale-programmes/programme-detail/computer-science-and-engineering",
    requirements: "Bachelor's in Computer Science and Engineering preferred (other degrees need fundamental computer science, science and engineering courses); minimum grade average required; certificate of good English",
    lastVerified: verifiedOn
  }
];

async function seed() {
  try {
    await connectDB();
    await Program.deleteMany({});
    await Program.insertMany(programs);
    console.log(`Added ${programs.length} real programs`);
  } catch (error) {
    console.log("Seeding failed:", error.message);
  }
  await mongoose.disconnect();
}

seed();
