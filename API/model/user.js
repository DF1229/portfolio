// This file defines the MongoDB schema of a user
// This file gets called by app.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user: {type: String},
    email: {type: String},
    password: {type: String},
    admin: {type: Boolean, default: false}
});

module.exports = mongoose.model("user", userSchema);