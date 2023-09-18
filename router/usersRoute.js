const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Datastore = require('nedb');

const db = new Datastore({ filename: './databse/users.db', autoload: true });

router.post('/newUser', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ error: 'Error hashing password' });
    }

    const user = {
      username: username,
      password: hashedPassword,
    };

    db.insert(user, (insertErr, insertedUser) => {
      if (insertErr) {
        console.error('Error inserting user into the database:', insertErr);
        return res.status(500).json({ error: 'Error inserting user into the database' });
      }

      res.status(201).json({ message: 'User added to the database', user: insertedUser });
    });
  });
});

module.exports = router;