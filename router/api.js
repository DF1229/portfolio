// This file servers as a router for all API calls, most - if not all - database interactions are in this file.
// This file gets called by app.js
const express = require('express');
const bcrypt = require('bcryptjs');
const auth = require('../API/authentication');

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
    .get((req, res) => { res.status(301).redirect('/') })
    .post(async (req, res) => {
        if (req.params.path == 'login') {
            try {
                const { username, password } = req.body;
                if (!(username && password)) {
                    return res.status(400).render('user/login', { errMsg: "Missing username or password" });
                }

                const user = await User.findOne({ username });
                if (user && (await bcrypt.compare(password, user.password))) {
                    const token = auth.generateToken(user, username);

                    res.cookie('user', user, cookieOptions.strict);
                    res.cookie(process.env.JWT_COOKIE, token, cookieOptions.strict);
                    res.status(200).redirect('/');
                } else if (!user) {
                    return res.status(401).render('user/login', { errMsg: "User not found", username: username });
                } else {
                    return res.status(401).render('user/login', { errMsg: "Invalid password", username: username });
                }

            } catch (error) {
                console.error(error);
                res.sendStatus(500);
            }
        } else if (req.params.path == 'create') {
            // Validate required data is present
            const { username, email, password } = req.body;
            if (!(username && email && password)) {
                return res.status(400).render('user/register', { errMsg: "Missing username, email, or password." });
            }

            // Attempt to find user with given emailadress
            const oldUser = await User.findOne({ email });
            if (oldUser) {
                return res.status(409).render('user/register', { errMsg: "User already exists." });
            }

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

            res.status(200).render('user/register', { statusMsg: "User registered" });
        } else if (req.params.path == 'update') {
            res.sendStatus(501);
        } else if (req.params.path == 'delete') {
            res.sendStatus(501);
        }
    });

router.route('/project/:action')
    .get((req, res) => { res.status(301).redirect('/') })
    .post(async (req, res) => {
        if (req.params.action == 'create') {
            const data = parseProjectData(req.body, req.cookies['user']);
            const oldProject = await Project.findOne({ title: data.title });
            if (oldProject) {
                res.status(400).render('project/create', { errMsg: "Title has been used before" });
            }

            const project = await Project.create(data);
            if (project) {
                res.status(200).render('project/create', { statusMsg: "Project added to database" });
            }
        } else if (req.params.action == 'update') {
            res.sendStatus(501);
        } else if (req.params.action == 'delete') {
            res.sendStatus(501);
        }
    });

function parseProjectData(body, user) {
    let { hidden } = body;
    hidden = (hidden ? true : false); // if enabled, raw value == "on"

    return {
        title: body.title,
        author: user.username,
        body: body.body,
        hidden
    }
}

module.exports = router;