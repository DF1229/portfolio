// This file defines the MongoDB schema of a token
// This file gets called by api.js
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: String,
    valid: {type: Boolean, default: true},
    name: {type: String, default: null}
});

module.exports = mongoose.moodel(tokenSchema);