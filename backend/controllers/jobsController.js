const { getDB } = require("../config/db");
const { ObjectId } = require('mongodb');


const getAllJobs = async (req, res) => {
    const { company, jobProfile, location, rating } = req.query;

    try {
        const db = getDB();
        let query = {};

        // Build the query based on provided filters
        if (company) query.company = company;
        if (jobProfile) query.jobProfile = jobProfile;
        if (location) query.location = location;
        if (rating) query.rating = parseFloat(rating); // Convert rating to float

        // Fetch all jobs data or filtered jobs data
        const jobs = await db.collection("jobList").find(query).toArray();

        return res.json({
            success: true,
            message: "Jobs fetched successfully",
            jobs: jobs
        });
    } catch (error) {
        console.error(`Error fetching jobs: ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const applyJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const email = req.email;

        if (jobId && email) {
            const db = getDB();
            
            // Find the job document from the jobList collection using the jobId
            const job = await db.collection("jobList").findOne({ _id: new ObjectId(jobId) });

            if (!job) {
                return res.status(404).json({ message: "Job not found" });
            }

            // Create or get the user's collection based on their email
            const userCollection = db.collection(email);

            // Insert the job document into the user's collection
            await userCollection.insertOne(job);

            console.log(`Job with ID ${jobId} applied by ${email}`);

            res.setHeader("Content-Type", "application/json");
            res.status(201).json({ message: "Job applied successfully" });
        } else {
            res.status(400).json({ message: "Please provide all job details" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const postJob = async (req, res) => {
    try {
        const { company, jobProfile, location, prerequisite, rating, salaryRange, imgUrl } = req.body;

        if (company && jobProfile && location && prerequisite && rating && salaryRange) {
            const db = getDB();

            // Check if imgUrl is provided, otherwise use the default image URL
            const imageToSave = imgUrl || "https://img.icons8.com/ios-glyphs/90/000000/organization.png";

            const jobData = {
                company,
                jobProfile,
                location,
                prerequisite,
                rating,
                salaryRange,
                imgUrl: imageToSave
            };

            // Save job data to the jobList collection
            await db.collection("jobList").insertOne(jobData);

            res.setHeader("Content-Type", "application/json");
            res.status(201).json({ message: "Job posted successfully" });
        } else {
            res.status(400).json({ message: "Please provide all job details" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = { getAllJobs, postJob, applyJob };
