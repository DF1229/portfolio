// This file defines the MongoDB schema of a request to the webserver
// This file gets called by app.js

const mongoose = require('mongoose');
const { request } = require('../../app');

const requestSchema = new mongoose.Schema({
    timestamp: {type: Date, default: Date.now},
    protocol: String,
    method: String,
    subdomains: [String],
    originalUrl: String,
    ip: String,
    ips: [String],
    body: String,
    baseUrl: String,
    path: String,
    cookies: String,
    fresh: Boolean,
    hostname: String,
    params: String,
    route: String,
    secure: Boolean,
    signedCookies: Boolean,
    stale: Boolean,
    xhr: Boolean,
    userAgent: String
});

module.exports = mongoose.model("request", requestSchema);