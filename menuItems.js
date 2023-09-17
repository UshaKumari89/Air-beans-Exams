const express = require('express');
const router = express.Router();
const Datastore = require('nedb');
const { authenticateToken } = require('./authentication'); // Import your authentication middleware if needed

const menuDB = new Datastore({ filename: './menuDatabase.db', autoload: true });

// Define a callback function for handling the POST request
// Define a callback function for handling the POST request
router.post('/add', authenticateToken, (req, res) => {
  console.log('POST /add route handler called');
  
  // Extract menu item details from req.body
  const menuItem = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    // Add any other menu item properties here
  };
  console.log('Received menu item:', menuItem);

  // Insert the menu item into the database
  menuDB.insert(menuItem, (err, newMenuItem) => {
    if (err) {
      console.error('Error adding menu item:', err);
      res.status(500).json({ error: 'Error adding menu item' });
    } else {
      console.log('Menu item added successfully:', newMenuItem);
      res.status(200).json({ message: 'Menu item added successfully!', newMenuItem });
    }
  });
});


  module.exports = router;