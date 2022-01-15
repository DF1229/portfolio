// This file defines what routes the API listens to, and how requests get handled.
// This file gets called by index.js.

// Load environment variables
require("dotenv").config();
// Connect to database
require("./API/database").connect();

// Import various node modules for later use
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const auth = require("./API/authentication");

// Import MongoDB schema's
const User = require("./API/model/user");
const Project = require("./API/model/project");

// Define app
const app = express();
app.use(express.json());

// ========<GET ROUTES>==========

app.get("/login", (req, res) => {
    res.status(200).sendFile(`${__dirname}/page/login.html`);
});

app.get("/register", (req, res) => {
    res.status(200).sendFile(`${__dirname}/page/register.html`);
});

// ========</GET ROUTES>=========
// ========<POST ROUTES>=========

app.post("/login", async (req, res) => {
    try {
        // Store & validate user input
        const {email, password} = req.body;
        if (!(email && password)) {
            res.status(400).send("Missing email or password");
        }

        // Find user and verify password.
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign (
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                { expiresIn: "2h" }
            );

            user.token = token;
            res.status(200).json(user);
        }

    } catch (error) {
        console.error(error);
    }
});

// ========</POST ROUTES>========

module.exports = app;