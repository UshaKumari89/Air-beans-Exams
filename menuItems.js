const express = require('express');
const router = express.Router();
const Datastore = require('nedb');
const { DateTime } = require('luxon'); // Import luxon
const { authenticateToken } = require('./authentication'); // Import your authentication middleware if needed

const menuDB = new Datastore({ filename: './menuDatabase.db', autoload: true });

// Define a callback function for handling the POST request 
  router.post('/add', authenticateToken, (req, res) => {
  // console.log('POST /add route handler called');
  
  // Extract menu item details from req.body
  const menuItem = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    createdAt: DateTime.now().setZone('Europe/Stockholm').toISO(), // Set timestamp to Stockholm time
    // Add any other menu item properties here
  };
  // console.log('Received menu item:', menuItem);

// Insert the menu item into the database
 // Inside your POST /add route handler
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

//update a menuitem
// Define a callback function for handling the PUT request to modify a product by id
router.put('/modify/:id', authenticateToken, (req, res) => {
  const productId = req.params.id; // Get the product id from the URL parameter

  // Extract the updated product details from req.body
  const updatedProduct = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    modifiedAt: DateTime.now().setZone('Europe/Stockholm').toISO(),
  };
  console.log('Updating product with ID:', productId, 'to:', updatedProduct);
  // Use menuDB.update to modify the product by specifying its _id
  menuDB.update({ _id: productId }, { $set: updatedProduct }, {}, (err, numReplaced) => {
    if (err) {
      console.error('Error modifying product:', err);
      res.status(500).json({ error: 'Error modifying product' });
    } else if (numReplaced === 0) {
      // If no product was modified, it means the product with that id does not exist
      console.error('Product not found with ID:', productId);
      res.status(404).json({ error: 'Product not found' });
    } else {
      // Product successfully modified
      console.log('Product modified successfully:', productId);
      res.status(200).json({ message: 'Product modified successfully' });
    }
  });
});






module.exports = router;