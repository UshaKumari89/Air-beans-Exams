const express = require('express');
const Datastore = require('nedb');

const app = express();
app.use(express.json()); // for parsing application/json

const db = new Datastore({ filename: './database.db', autoload: true });

app.post('/admin/signup', (req, res) => {
    // Get admin details from req.body
        let admin = {
            username: req.body.username,
            password: req.body.password ,// Remember to hash this!
            role : req.body.role
        };
 // Insert the admin into the database
    db.insert(admin, (err, newAdmin) => {
        if (err) {
            res.status(500).send('Error signing up admin');
        } else {
            res.status(200).send('Admin signed up successfully!');
        }
    });
    //to find the admin is already in the database
//to find the admin is already in the database
db.findOne({ username: admin.username }, (err, adminExist) => {
    if (err) {
     // handle error
     res.status(500).json({ error: "Internal server error" });
    } else if (adminExist) {
      // the admin already exists! send an error response
        res.status(409).json({
        // if user already exists, return error message
        error:
          "Looks like this username is already taken! Try being more original, dude!! ",
      });
    } else {
      // the admin doesn't exist yet, so you can proceed with inserting them into the database

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            res.status(500).json({ error: 'Internal server error' });
          } else {
            // Create a new admin user with hashed password
            const newAdminUser = {
              username,
              password: hashedPassword,
              role: 'admin', // Set the role to 'admin'
            };
      
            // Insert the admin user into the database
            usersDB.insert(newAdminUser, (err, user) => {
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
}); // <- This is where the closing parenthesis should be
})

app.listen(3000, () => console.log('Server running on port 3000'));