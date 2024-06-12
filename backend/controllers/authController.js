const { getDB } = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;


const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Email:", email, "Password:", password);

  try {
    const db = getDB();
    const user = await db.collection("allUsers").findOne({ email: email });

    if (!user) {
      // User not found
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Password mismatch
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Generate a JWT for the user
    const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });

    // Fetch necessary fields from the user and send them in the response
    const { _id, email: userEmail } = user;
    return res.json({
      success: true,
      message: "Login successful",
      token: token,
      user: { _id, email: userEmail },
    });
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const db = getDB();
      const checkUserExist = await db
        .collection("allUsers")
        .findOne({ email: email });

      if (checkUserExist) {
        res.setHeader("Content-Type", "application/json");
        res.status(400).json({ message: "User already exists" });
      } else {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const userInput = {
          ...req.body,
          password: hashedPassword
        };

        // Store the new user with the hashed password
        await db.collection("allUsers").insertOne(userInput);

        // Generate a JWT for the new user
        const token = jwt.sign({ email: email }, secretKey, { expiresIn: '1h' });

        res.setHeader("Content-Type", "application/json");
        res.status(201).json({ message: "New user registered"});
      }
    } else {
      res.status(400).json({ message: "Please provide all details" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { login, signup };
