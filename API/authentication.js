// This file handles user authentication based on a JSON Web Token (JWT).
// This file gets called by app.js

const jwt = require("jsonwebtoken");

module.exports = {
    generateToken(user, username) {
        const token = jwt.sign(
            { user_id: user._id, username },
            process.env.JWT_KEY,
            { expiresIn: "2h" }
        );

        return token;
    },
    verifyToken(req, res) {
        const token = req.cookies[process.env.JWT_COOKIE];

        if (!token) {
            return res.status(400).render('index', {debugMsg: "no token present"});
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            req.user = decoded;
            return true;
        } catch (error) {
            return false;
        }
    }
}