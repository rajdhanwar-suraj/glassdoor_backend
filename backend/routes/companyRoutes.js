const express = require("express");
const router = express.Router();

//controllers
const { getAllCompany , postCompany , compareCompany} = require("../controllers/companyController");

//routes
router.post("/getAllCompany", getAllCompany);

//registration
router.post("/postCompany", postCompany);

//registration
router.post("/compareCompany", compareCompany);

module.exports = router;
