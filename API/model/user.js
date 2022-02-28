// This file defines the MongoDB schema of a user
// This file gets called by public.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String}, // unique
    email: {type: String}, // unique
    password: {type: String},
    admin: {type: Boolean, default: false}
});

module.exports = mongoose.model("user", userSchema);