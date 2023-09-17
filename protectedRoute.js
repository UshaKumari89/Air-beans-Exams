// protectedRoute.js

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./authentication'); // Import your authentication middleware

router.get('/protected-route', authenticateToken, (req, res) => {
    // This route is protected and will only be accessible with a valid token
    // You can perform any authenticated actions here
  
    // For example, you can access user information from req.user (if available)
    const { username, role } = req.user;
  
    // Perform actions based on user's role or access level
    if (role === 'admin') {
      // Allow admin-specific actions
      res.json({ message: 'Admins have access to this route.' });
    } else {
      // Allow general user actions
      res.json({ message: 'Regular users have access to this route.' });
    }
  });
  
module.exports = router;
