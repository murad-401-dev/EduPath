require("dotenv").config();
const mongoose = require("mongoose");
const Program = require("./models/Program");
const connectDB = require("./db");

const demoPrograms = [
  {
    name: "M.Sc. in Computer Science and Engineering",
    university: "Daffodil International University",
    country: "Bangladesh",
    degree: "MSc",
    subject: "Computer Science and Engineering",
    tuition: 2000,
    duration: "1.5 years"
  },
  {
    name: "M.Sc. in Software Engineering",
    university: "Daffodil International University",
    country: "Bangladesh",
    degree: "MSc",
    subject: "Software Engineering",
    tuition: 2000
  },
  {
    name: "M.Sc. in Cyber Security",
    university: "Daffodil International University",
    country: "Bangladesh",
    degree: "MSc",
    subject: "Cyber Security",
    tuition: 2200
  }
];

async function seed() {
  try {
    await connectDB();
    await Program.deleteMany({});
    await Program.insertMany(demoPrograms);
    console.log(`Added ${demoPrograms.length} demo programs`);
  } catch (error) {
    console.log("Seeding failed:", error.message);
  }
  await mongoose.disconnect();
}

seed();
