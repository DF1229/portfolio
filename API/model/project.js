// This file defines the MongoDB schema of a project
// This file gets called by app.js

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {type: String},
    author: {type: String},
    body: {type: String},
    date: {type: Date, default: Date.now},
    hidden: {type: Boolean, default: false},
    views: {type: Number, default: 0}
});

module.exports = mongoose.model("project", projectSchema);