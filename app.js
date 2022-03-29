// This file defines what routes the API listens to, and how requests get handled.
// This file gets called by index.js.
require('./API/database').connect();

// Various imports
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Logging setup
const date = new Date();
const dateString = `${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()}`;
let logStream = fs.createWriteStream(path.join(__dirname, `/logs/${dateString}.log`), { flags: 'a' });

// Define app
const app = express();
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());

// Define routers
const apiRouter = require('./router/api');
const publicRouter = require('./router/public');

// Define rate limiters
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 25, // Limit each IP to 100 request per window
    standardHeaders: true,
    legacyHeaders: false
});

// Set order of routers
app.use('/api', apiLimiter, morgan('combined', { stream: logStream }), apiRouter);
app.use('/', morgan('combined', { stream: logStream }), publicRouter);

module.exports = app;
