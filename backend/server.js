require("dotenv").config();

const express = require("express");
const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes");
const programRoutes = require("./routes/programRoutes");
const eligibilityRoutes = require("./routes/eligibilityRoutes");
const matchRoutes = require("./routes/matchRoutes");
const scholarshipRoutes = require("./routes/scholarshipRoutes");
const shortlistRoutes = require("./routes/shortlistRoutes");

const app = express();

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("EduPath API is running");
});

app.use("/api/users", userRoutes);

app.use("/api/programs", programRoutes);

app.use("/api/eligibility", eligibilityRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/shortlist", shortlistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
