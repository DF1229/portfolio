// This file handles user authentication based on a JSON Web Token (JWT).
// This file gets called by app.js

const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = process.env;

module.exports = {
    generateToken(user, username) {
        const token = jwt.sign(
            { user_id: user._id, username },
            process.env.JWT_KEY,
            { expiresIn: "2h" }
        );

        return token;
    },
    verifyToken(res, req) {
        const token = req.cookies[process.env.TOKEN_HEADER];

        if (!token) {
            return false;
        }

        try {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            req.user = decoded;
            return true;
        } catch (error) {
            return false;
        }
    }
}