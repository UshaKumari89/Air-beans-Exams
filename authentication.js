const jwt = require('jsonwebtoken');

    const secretKey = "your_secret_key"; // Make sure this matches the one in your middleware


    function createToken(user)    {
        let payload = user;
        let options = {expiresIn: "1d"};  // the token will expire in 1 day
        return jwt.sign(payload, secretKey, options);
    }
    function authenticateToken(req, res, next) {
        // Get the token from the request headers
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401) // if there isn't any token
       try {
        const user = validateToken(token);
                console.log("user", user);
                req.user = user ;
                next();
       } catch (error) {
        res.sendStatus(403);
       }

       
    }
    function validateToken(token){
        try {
          

          const user =  jwt.verify(token, secretKey);
          console.log(user);
        return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

  

    function testToken(){
         const myToken=createToken("test");
         console.log(myToken);
         const user = validateToken(myToken);
         console.log("success");
    }

    module.exports = { createToken, authenticateToken, testToken };