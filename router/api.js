// This file servers as a router for all API calls, most database interactions are in this file.
// This file gets called by app.js
const express = require('express');
const bcrypt = require('bcryptjs');

// Router definition
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

// MongoDB models
const User = require('../API/model/user');
const Project = require('../API/model/project');

const cookieOptions = {
    strict: {
        httpOnly: true,
        sameSite: "Strict"
    },
    lax: {
        httpOnly: false,
        sameSite: "Lax"
    }
}

router.route('/user/:path')
    .get((req, res) => { res.status(405).redirect('/') })
    .post(async (req, res) => {
        if (req.params.path == 'login') {
            try {
                const { username, password } = req.body;
                if (!(username && password)) {
                    return res.status(400).render('login', { errMsg: "Missing username or password" });
                }

                const user = await User.findOne({ username });
                if (user && (await bcrypt.compare(password, user.password))) {

                    res.cookie('user', user, cookieOptions.strict);
                    res.status(200).redirect('/');
                } else if (!user) {
                    return res.status(401).render('login', { errMsg: "User not found", username: username });
                } else {
                    return res.status(401).render('login', { errMsg: "Invalid password", username: username });
                }

            } catch (error) {
                console.error(error);
                res.sendStatus(500);
            }
        } else if (req.params.path == 'register') {
            // Validate required data is present
            const { username, email, password } = req.body;
            if (!(username && email && password)) {
                return res.status(400).render('admin', { errMsg: "Missing username, email, or password." });
            }

            // Attempt to find user with given emailadress or username
            let oldUser = await User.findOne({ email });
            oldUser = (oldUser == null ? await User.findOne({username}) : null);
            if (oldUser) return res.status(409).render('user/register', { errMsg: "User already exists." });

            // Handle user creation
            let { admin } = req.body;
            admin = (admin ? true : false); // if enabled, raw value == "on"

            let encryptedPassword = await bcrypt.hash(password, 10);
            await User.create({
                username,
                email,
                password: encryptedPassword,
                admin
            });

            res.status(200).render('status', { statusMsg: "User succesfully registered" });
        } else if (req.params.path == 'update') {
            res.sendStatus(501);
        } else if (req.params.path == 'delete') {
            res.sendStatus(501);
        }
    });

router.route('/project/:action')
    .get((req, res) => { res.status(405).setHeader("Allow", "POST").redirect('/') })
    .post(async (req, res) => {
        if (req.params.action == "register") {
            // Aquire and parse required data
            const { title, preview, body, imgLink, github, visibility } = req.body;
            let { timeToRead } = req.body;
            timeToRead = (timeToRead ? timeToRead : 5);

            // Validate required data is present
            if (!(title && preview && body && imgLink && github && visibility && timeToRead))
                return res.status(400).render('admin', { errMsg: "Missing required information, please double-check the input." });

            // Parse visibility variable into boolean
            let hidden;
            if (visibility == "everyone")
                hidden = false;
            else if (visibility == "admins")
                hidden = true;

            // Attempt to find project with given title or preview text
            let oldProject = await Project.findOne({ title });
            oldProject = (oldProject == null ? await Project.findOne({ preview }) : null);
            
            if (oldProject) return res.status(409).render('admin', {errMsg: "Project with given title or preview text already exists."});

            // Handle project creation and insertion into database
            await Project.create({
                title,
                author: req.cookies['user'].username,
                preview,
                body,
                imgLink,
                github,
                timeToRead,
                hidden
            });

            res.status(200).render('status', { statusMsg: "Project succesfully registered." });
        }
    });

router.route('/project/:action/:project_id')
    .get((req, res) => { res.status(405).setHeader("Allow", "POST").redirect('/') })
    .post(async (req, res) => {
        if (req.params.action == "view") {
            res.send(501);
        } else if (req.params.action == "update") {
            res.send(501);
        } else if (req.params.action == "delete") {
            res.send(501);        }
    });

module.exports = router;