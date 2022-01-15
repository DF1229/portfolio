// This file handles user authentication based on a JSON Web Token (JWT).
// This file gets called by app.js

const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = process.env;

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.header["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(token, TOKEN_KEY);
        req.user = decoded;
    } catch (error) {
        return res.status(401).send("Invalid token");
    }
    return next();
}

module.exports = verifyToken;