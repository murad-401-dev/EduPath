require("dotenv").config();

const express = require("express");
const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes");
const programRoutes = require("./routes/programRoutes");

const app = express();

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("EduPath API is running");
});

app.use("/api/users", userRoutes);

app.use("/api/programs", programRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
