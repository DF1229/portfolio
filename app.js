// This file defines what routes the API listens to, and how requests get handled.
// This file gets called by index.js.

// Connect to database
require("./API/database").connect();

// Import various node modules for later use
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");

// Import MongoDB schema's
const User = require("./API/model/user");
const Project = require("./API/model/project");

// Define app
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



module.exports = app;