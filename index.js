// Running the app starts here, this file creates the HTTP server and opens the port for the underlying API.
// This file gets called manually.
const fs = require('fs');

// Load environment variables
require("dotenv").config();

const app = require('./app');

// Define HTTPS credentials
const credentials = {
    key: fs.readFileSync('sslcert/key.pem'),
    cert: fs.readFileSync('sslcert/cert.pem')
}

// Start HTTP server with app.js
const http = require("http");
const httpServer = http.createServer(app);

// Start HTTPS server with app.js
const https = require('https');
const httpsServer = https.createServer(credentials, app);

// Define port the server should listen on
const { HTTP_PORT, HTTPS_PORT } = process.env;

httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP:${HTTP_PORT} LISTENING`);
});

httpsServer.listen(HTTPS_PORT, () => {
    console.log(`HTTPS:${HTTPS_PORT} LISTENING`);
});

// Uncaught error logging
process.on('uncaughtException', err => {
    const now = new Date();
    fs.writeFile(
        `logs/${now.getTime()}.errlog`,
        err.message,
        {flag: 'a'},
        exitProcess(1)
    );
});

function exitProcess(code) {
    process.exit(code);
}