// This file handles user authentication based on a JSON Web Token (JWT).
// This file gets called by app.js

const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = process.env;

module.exports = {
    generateToken(user, username) {
        const token = jwt.sign(
            { user_id: user._id, username },
            process.env.TOKEN_KEY,
            { expiresIn: "2h" }
        );

        return token;
    },
    verifyToken(res, req) {

    }
}