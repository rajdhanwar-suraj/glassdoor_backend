const express = require("express");
const router = express.Router();

//Middleware
const { authenticateToken } =require("../middleware/authMiddleware")

//controllers
const { getAllJobs , postJob , applyJob } = require("../controllers/jobsController");

//routes
router.post("/getAllJobs", getAllJobs);

//registration
router.post("/postJob", postJob);

//registration
router.post("/applyJob", authenticateToken , applyJob);

module.exports = router;
