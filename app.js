// This file defines what routes the API listens to, and how requests get handled.
// This file gets called by index.js.
require('./API/database').connect();

// Various imports
const rfs = require('rotating-file-stream');
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Logging setup
const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'October', 'November', 'December'];
const pad = num => (num > 9 ? "" : "0") + num;
const nameGenerator = (time, index) => {
    if (!time) time = new Date();

    const year = time.getUTCFullYear();
    const month = months[time.getUTCMonth()];
    const day = pad(time.getUTCDate());
    return `${year}/${month}/${day}.log`;
};

const logStream = rfs.createStream(
    nameGenerator, {
    interval: '1d',
    path: path.join(__dirname, 'logs')
});

// Define app
const app = express();
app.use(morgan('combined', { stream: logStream } ));
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
app.use('/api', apiLimiter, apiRouter);
app.use('/', publicRouter);

module.exports = app;
