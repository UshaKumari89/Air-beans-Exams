const express = require('express');
const router = express.Router();
const app = express();
const Datastore = require('nedb');
const bcrypt = require('bcryptjs');
const { createToken } = require('./auth');
const jwt = require("jsonwebtoken");


const db = new Datastore({ filename: './databse/admin.db', autoload: true });
// Signup logic for admin users
router.post('/signup', (req, res) => {
    // Get admin details from req.body
    let admin = {
      username: req.body.username,
      password: req.body.password, // Remember to hash this!
      role: req.body.role,
    };
  
    // Check if the admin is already in the database
    db.findOne({ username: admin.username }, (err, adminExist) => {
      if (err) {
        // Handle error
        res.status(500).json({ error: 'Internal server error' });
      } else if (adminExist) {
        res.status(409).json({
          error:
            "user name already exist!!! ",
        });
      } else {
         bcrypt.hash(admin.password, 10, (err, hashedPassword) => {
          if (err) {
            res.status(500).json({ error: 'Internal server error' });
          } else {
            // Create a new admin user with hashed password
            const newUser = {
              username: admin.username,
              password: hashedPassword,
              role: admin.role,
            };
  
            // Insert the admin user into the database
            db.insert(newUser, (err, user) => {
              if (err) {
                res.status(500).json({ error: 'Internal server error' });
              } else {
                res.status(201).json(user);
              }
              // Optionally, you can add further logic here for success or failure.
            });
          }
        });
      }
    });
  });

// Login logic
// router.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   // Find the user in the DB by their username
//   db.findOne({ username: username }, (err, user) => {
//     if (err) {
//       console.error('Error occurred while querying the user:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     if (!user) {
//       return res.status(401).json({
//         error: 'Invalid username.... Try again.',
//       });
//     }
//    // Compare the provided password with the hashed password in the database
// bcrypt.compare(password, user.password, (err, result) => {
//   if (result) {
//     // User's password is correct; create the token for any user
//     const payload = {
//       user: {
//         username: user.username,
//         role: user.role,
//       },
//     };
//     const token = createToken(payload);
    
//     // Now check their role
//     if (user.role === 'admin') {
//       res.status(200).json({ token });
//     } else {
//       res.status(200).json({ token, message: 'Logged in, you are not a admin.' });
//     }
//   } else {
//     res.status(401).json({ error: 'Wrong password, try again!' });
//   }
// });
//   });
// });
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user in the DB by their username
  db.findOne({ username: username }, (err, user) => {
    if (err) {
      console.error('Error occurred while querying the user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!user) {
      return res.status(401).json({
        error: 'Invalid username or password. Try again.',
      });
    }
    
    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        // User's password is correct; create the token for the user
        const payload = {
          user: {
            username: user.username,
            role: user.role,
          },
        };
        const token = createToken(payload);
        
        // Respond with the token
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: 'Wrong password, try again!' });
      }
    });
  });
});

module.exports = router;