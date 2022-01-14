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

// =========<ROUTES>=========

app.post("/login.rq", (req, res) => {
    console.log(req);
    res.status(200).send("OK");
});

// ========</ROUTES>=========

module.exports = app;