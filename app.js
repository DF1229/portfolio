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
const pad = num => (num > 9 ? "" : "0") + num;
const nameGenerator = (time, index) => {
    if (!time) return "file.log";

    const year = time.getFullYear();
    const month = pad(time.GetMonth() + 1);
    const day = pad(time.GetDate());

    return `${year}-${month}-${day}/${index}.log`;
};

const logStream = rfs.createStream(
    nameGenerator, {
    interval: '1d',
    path: path.join(__dirname, 'logs')
});

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
app.use('/api', apiLimiter, morgan('common', { stream: logStream }), apiRouter);
app.use('/', morgan('common', { stream: logStream }), publicRouter);

module.exports = app;
