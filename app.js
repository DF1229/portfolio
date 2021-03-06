// This file defines what routes the API listens to, and how requests get handled.
// This file gets called by index.js.
require('./API/database').connect();

// Various imports
const requestLogger = require('./custom_modules/requestLogger');
const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Define app
const app = express();
app.use(requestLogger);
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
