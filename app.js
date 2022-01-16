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

app.route('/:path').all((req, res) => {
    res.sendStatus(404);
});

function logger(req, res, next) {
    console.log(`${req.method} ${req.originalUrl}`);
    console.log(req.cookies);
    next();
}

module.exports = app;