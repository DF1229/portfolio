// This file defines how requests to the / route should get handled
// This file gets called by app.js

const express = require("express");

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const ProjectModel = require('../API/model/project');
const UserModel = require('../API/model/user');

router.get('/login', (req, res) => {
    res.status(200).render('login');
});

router.get('/logout', (req, res) => {
    res.clearCookie('user').status(200).redirect('/');
});

router.get('/admin', async (req, res) => {
    if (!req.cookies['user']) {
        return res.status(401).render('login', { errMsg: "Error: not logged in" });
    }

    if (!req.cookies['user'].admin) {
        return res.status(401).render('login', { errMsg: "Error: unauthorized" });
    }

    const projects = await ProjectModel.find();
    const users = await UserModel.find();
    res.status(200).render('admin', { user: req.cookies['user'], users: users, projects: projects});
});

router.get('/register', async (req, res) => {
    // --------- used during development to override authentication ------------
    // const users = await UserModel.find();
    // const projects = await ProjectModel.find();
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

router.get('/project/view/:id', async (req, res) => {
    const id = req.params.id;
    const project = await ProjectModel.findOne({ _id: id });
    if (!project) return res.status(400).render('status', { errMsg: "Project not found in database" });

    res.status(200).redirect(project.github);
    
    const newViews = ++project.views;
    let updateSuccess = await ProjectModel.updateOne({ _id: id }, { views: newViews }, { upsert: true});
    console.log(updateSuccess);
});

router.get('/contact', (req, res) => {
    res.sendStatus(501);
});

router.route('/')
    .post((req, res) => { res.sendStatus(418); })
    .get(async (req, res) => {
    const projects = await ProjectModel.find({ hidden: false });
    res.status(200).render('index', { user: req.cookies['user'], projects: projects });
});

function verifyToken(req, res) {
    if (!auth.verifyToken(req, res)) {
        return res.status(401).render('login', { errMsg: "Access token expired, or otherwise invalidated" });
    }
}

module.exports = router;
