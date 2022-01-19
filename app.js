// This file defines what routes the API listens to, and how requests get handled.
// This file gets called by index.js.
require('./API/database').connect();

const cookieParser = require('cookie-parser');
const express = require("express");

// Define app
const app = express();
app.use(express.static('public'));
app.set('views', __dirname + '\\views');
app.set('view engine', 'ejs');
app.use(cookieParser());

// Define routers
const apiRouter = require('./router/api');
const publicRouter = require('./router/public');

// Set order of routers
app.use('/api', logger, apiRouter);
app.use('/', logger, publicRouter);

function logger(req, res, next) {
    console.log(`${new Date().toLocaleTimeString()} ${req.ip} ${req.method} ${req.originalUrl}`);
    next();
}

module.exports = app;