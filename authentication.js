    const jwt = require('jsonwebtoken');

    const secretKey = "your_secret_key"; // Make sure this matches the one in your middleware


    function createToken(userId)    {
        let payload = {userId: userId};
        let options = {expiresIn: "1d"};  // the token will expire in 1 day
        return jwt.sign(payload, secretKey, options);
    }

    function authenticateToken(req, res, next) {
        // Get the token from the request headers
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401) // if there isn't any token

        jwt.verify(token, secretKey, (err, user) => {
            if (err) return res.sendStatus(403)
            req.user = user
            next() // pass the execution off to whatever request the client intended
        })
    }

    module.exports = { createToken, authenticateToken };