// This file defines how requests to the / route should get handled
// This file gets called by app.js

const express = require("express");
const auth = require('../API/authentication');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const Project = require('../API/model/project');
const User = require('../API/model/user');

router.get('/login', (req, res) => {
    res.status(200).render('login');
});

router.get('/admin', async (req, res) => {
    if (!req.cookies[process.env.JWT_COOKIE]) {
        return res.status(401).render('login', { errMsg: "Error: unauthorized" });
    }

    if (!verifyToken(req, res)) {
        return res.status(401).render('login', { errMsg: "Error: unauthorized" });
    }

    if (!req.cookies['user'].admin) {
        return res.status(401).render('login', { errMsg: "Error: unauthorized" });
    }

    const projects = await Project.find();
    const users = await User.find();
    res.status(200).render('admin', { user: req.cookies['user'], users: users, projects: projects});
});

router.get('/register', async (req, res) => {
    // --------- used during development to override authentication ------------
    // const users = await User.find();
    // const projects = await Project.find();
    // return res.render('admin', { users: users, projects: projects });
    // -------------------------------------------------------------------------

    if (!req.cookies['user']) {
        return res.status(403).redirect('/login');
    }

    if (!req.cookies['user'].admin) {
        return res.status(403).redirect('/');
    }

    res.status(200).render('user/register');    
});

router.get('/contact', (req, res) => {
    res.sendStatus(501);
});

router.route('/')
    .post((req, res) => { res.sendStatus(418); })
    .get(async (req, res) => {
    const projects = await Project.find({ hidden: false });
    res.status(200).render('index', { user: req.cookies['user'], projects: projects });
});

function verifyToken(req, res) {
    if (!auth.verifyToken(req, res)) {
        return res.status(401).render('login', { errMsg: "Access token expired, or otherwise invalidated" });
    }
}

module.exports = router;