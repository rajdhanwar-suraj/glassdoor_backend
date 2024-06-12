const { getDB } = require("../config/db");

const getAllCompany = async (req, res) => {
    const { name, companyType, location, rating } = req.query;

    try {
        const db = getDB();
        let query = {};

        // Build the query based on provided filters
        if (name) query.name = name;
        if (companyType) query.companyType = companyType;
        if (location) query.location = location;
        if (rating) query.rating = parseFloat(rating); // Convert rating to float

        // Fetch all company data or filtered company data
        const companies = await db.collection("companies").find(query).toArray();

        return res.json({
            success: true,
            message: "Companies fetched successfully",
            companies: companies
        });
    } catch (error) {
        console.error(`Error fetching companies: ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const compareCompany = async (req, res) => {
    try {
        const { firstCompany, secondCompany } = req.body;

        if (firstCompany && secondCompany) {
            const db = getDB();

            // Fetch the two company documents based on their names
            const companies = await db.collection("companies").find({
                name: { $in: [firstCompany, secondCompany] }
            }).toArray();

            if (companies.length === 2) {
                const firstCompanyData = companies.find(company => company.name === firstCompany);
                const secondCompanyData = companies.find(company => company.name === secondCompany);

                // Proceed with further operations using firstCompanyData and secondCompanyData
                res.setHeader("Content-Type", "application/json");
                res.status(200).json({
                    message: "Companies fetched successfully",
                    firstCompany: firstCompanyData,
                    secondCompany: secondCompanyData
                });
            } else {
                res.status(404).json({ message: "One or both companies not found" });
            }
        } else {
            res.status(400).json({ message: "Please provide both company names" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const postCompany = async (req, res) => {
    try {
        const { revenue, reviews, salary, ceo, companyType, foundedYear, logo, name, rating, status, totalEmployee, website } = req.body;

        if (revenue && reviews && salary && ceo && companyType && foundedYear && name && rating && status && totalEmployee && website) {
            const db = getDB();

            // Check if logo is provided, otherwise use the default image URL
            const logoToSave = logo || "https://img.icons8.com/ios-glyphs/90/000000/organization.png";

            const companyData = {
                revenue,
                reviews,
                salary,
                ceo,
                companyType,
                foundedYear,
                logo: logoToSave,
                name,
                rating,
                status,
                totalEmployee,
                website
            };

            // Save company data to the companies collection
            await db.collection("companies").insertOne(companyData);

            res.setHeader("Content-Type", "application/json");
            res.status(201).json({ message: "Company posted successfully" });
        } else {
            res.status(400).json({ message: "Please provide all company details" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



module.exports = { getAllCompany, postCompany, compareCompany };
