// This file defines what routes the API listens to, and how requests get handled.
// This file gets called by index.js.
const cookieParser = require('cookie-parser');
const express = require("express");
const app = express();

const publicRouter = require('./router/public');
app.set('views', __dirname + '\\views');
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use('/', logger, publicRouter);

function logger(req, res, next) {
    console.log(`${req.ip} ${req.method} ${req.originalUrl}`);
    next();
}

module.exports = app;