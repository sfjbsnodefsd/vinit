const jwt = require("jsonwebtoken");

module.exports = async function isAuthenticated(req, res, next) {
    // Token is in the form -> Bearer <token>; That is why we need to split
    const token = req.headers["authorization"].split(" ")[1];

    jwt.verify(token, "secret", (err, user) => {
        if(err) {
            return res.status(401).json({
                success: 0,
                message: "Unauthorized"
            })
        } else {
            req.user = user;
            next();
        }
    });
};