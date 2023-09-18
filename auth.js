const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key";
// authenticateToken
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
   //console.log("Token in authenticateToken:", token);
  if (token == null) {
    console.error("JWT token missing");
    return res.sendStatus(401);
  }try {
    const user = validateToken(token);
    req.user = user;
    //console.log("User in authenticateToken:", req.user);
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    res.sendStatus(403);
  }
}
// createToken
function createToken(payload) {
  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  return token;
}
// validateToken
function validateToken(token) {
  const decodedToken = jwt.verify(token, secretKey);
  // console.log("Decoded token in validateToken:", decodedToken);
  return decodedToken.user;
}
// checkAdminRole
function checkAdminRole(req, res, next) {
  const user = req.user;
  // console.log("User Role:", user.role);

  if (user && user.role === "admin") {
    // User has the "admin" role and matches the desired username, allow access
    next();
  } else {
    // User does not have the "admin" role or does not match the desired username, deny access
    res.status(403).json({ error: "Access denied. User is not an admin." });
  }
}

module.exports = { authenticateToken, createToken, checkAdminRole };
