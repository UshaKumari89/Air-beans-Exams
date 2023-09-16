const express = require('express');
const router = express.Router();
const app = express();
const Datastore = require('nedb');
const bcrypt = require('bcryptjs');
const { createToken } = require('./authentication');
const jwt = require("jsonwebtoken");


const db = new Datastore({ filename: './database.db', autoload: true })

// Signup logic
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
        // The admin already exists! Send an error response
        res.status(409).json({
          // If user already exists, return an error message
          error:
            "Looks like this username is already taken! Try being more original, dude!! ",
        });
      } else {
        // If the username is unique, proceed with hashing the password and inserting the admin
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

router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Find the user in the DB by their username
    db.findOne({ username: username }, (err, user) => {
      if (err) {
        console.error('Error occurred while querying the user:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    if (!user) {
        res.status(401).json({
          error: 'Invalid username or user does not exist. Try again.',
        });
    } else {
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              const payload = {
                user: {
                  username: user.username,
                  role: user.role,
                },
              };
    
              const token = jwt.sign(payload, "key", { expiresIn: "1h" });
    
              res.status(200).json({ token });
            } else {
              res.status(401).json({ error: "Wrong password, buddy boy!" });
            }
          });
    }
     })

})

module.exports = router;