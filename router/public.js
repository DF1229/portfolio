const express = require("express");
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

router.route('/')
    .get((req, res) => {
        if (!req.cookies.user) {
            res.status(400).render('login', {"errMsg" : "Please login to access the rest of the site"});
        } else {
            res.status(200).send("OK");
        }
    });

router.route('/login')
    .get((req, res) => {
        res.status(200).redirect('/user/login.html');
    })
    .post(async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!(username && password)) {
                res.status(400).render('./');
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        }
    });

router.get('/register', (req, res) => {
    res.status(200).redirect('/user/register.html');
});

module.exports = router;