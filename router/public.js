// This file defines how requests to the / route should get handled
require('../API/database').connect();
const User = require('../API/model/user');

const jwt = require('jsonwebtoken');
const express = require("express");
const bcrypt = require('bcryptjs');
const auth = require('../API/authentication');

const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

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

router.route('/')
    .get((req, res) => {
        if (!auth.verifyToken(res, req)) {
            return res.status(401).render('login');
        }

        res.status(200).render('index', {debugMsg: "Logged in 🍪"});
    });

router.route('/login')
    .get((req, res) => {
        res.status(200).redirect('/');
    })
    .post(async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!(username && password)) {
                return res.status(400).render('login', { "errMsg": "Missing username or password" });
            }

            const user = await User.findOne({ username });
            if (user && (await bcrypt.compare(password, user.password))) {
                const token = auth.generateToken(user, username);
                
                res.cookie('user', user, cookieOptions.strict);
                res.cookie(process.env.TOKEN_HEADER, token, cookieOptions.strict);
                res.status(200).render('index');
            }

        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        }
    });

router.route('/register')
    .get((req, res) => {
        res.status(200).render('register');
    })
    .post(async (req, res) => {
        // Validate required data is present
        const { username, email, password } = req.body;
        if (!(username && email && password)) {
            return res.status(400).render('register', {errMsg: "Missing username, email, or password."});
        }

        // Attempt to find user with given emailadress
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).render('register', {errMsg: "User already exists."});
        }

        // Handle user creation
        let { admin } = req.body; 
        admin = (admin ? true : false); // if enabled, raw value = "on"

        let encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: encryptedPassword,
            admin
        });
        
        const token = auth.generateToken(user, username);
        res.cookie(process.env.TOKEN_HEADER, token, cookieOptions.strict);

        res.status(200).redirect('/');
    });

module.exports = router;