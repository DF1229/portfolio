// This file defines how requests to the / route should get handled
// This file gets called by app.js

const express = require("express");
const auth = require('../API/authentication');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const Project = require('../API/model/project');

// <TODO>
router.get('/project/:action/:id', (req, res) => {
    res.sendStatus(501);
});
// </TODO>

router.get('/:page', (req, res) => {
    if (req.params.page == 'verify') {
        res.sendStatus(501);
    } else if (req.params.page == 'login') {
        res.status(200).render('user/login');
    } else if (req.params.page == 'admin') {
        if (!req.cookies[process.env.JWT_COOKIE]) {
            return res.status(200).render('user/login');
        }

        if (!auth.verifyToken(req, res)) {
            return res.status(401).render('user/login', { errMsg: "Access token expired, or otherwise invalidated" });
        }

        if (!req.cookies['user'].admin) {
            return res.sendStatus(403);
        }

        res.status(200).render('admin', { user: req.cookies['user'] });
    } else if (req.params.page == 'register') {
        // return res.render('user/register');

        if (!req.cookies['user']) {
            return res.status(403).redirect('/login');
        }

        if (!req.cookies['user'].admin) {
            return res.status(403).redirect('/');
        }

        res.status(200).render('user/register');
    } else if (req.params.page == 'contact') {
        res.sendStatus(501);
    } else {
        res.sendStatus(404);
    }
});

router.post('/', (req, res) => { res.sendStatus(418); });
router.get('/', async (req, res) => {
    if (!req.cookies[process.env.JWT_COOKIE]) {
        return res.status(200).render('user/login');
    }

    if (!auth.verifyToken(req, res)) {
        return res.status(401).render('user/login', { errMsg: "Access token expired, or otherwise invalidated" });
    }

    const projects = await Project.find({ hidden: false });
    res.status(200).render('index', { user: req.cookies['user'], projects: projects });
});

module.exports = router;