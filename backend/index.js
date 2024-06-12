// app.js
const express = require("express");
const path = require("path");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const jobsRoutes = require("./routes/jobsRoutes");
const companyRoutes = require("./routes/companyRoutes");


const { connectDB } = require("./config/db");

const app = express();
const port = 5001;
// Connect to MongoDB
connectDB();

// Middleware setup for CORS
const whitelist = [
  "http://localhost:3000",
  "http://localhost:5001",
  "https://glassdoor7050.netlify.app",
  "http://glassdoor7050.netlify.app"
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(express.json());
app.use(cors(corsOptions));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/company", companyRoutes);

// New route for the root URL
app.get("/", (req, res) => {
  res.send("Glassdoor Backend Is Started");
});



// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
// });

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




