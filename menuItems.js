const express = require('express');
const router = express.Router();
const Datastore = require('nedb');
const { DateTime } = require('luxon'); // Import luxon
const { authenticateToken } = require('./authentication'); // Import your authentication middleware if needed

const menuDB = new Datastore({ filename: './menuDatabase.db', autoload: true });

// Define a callback function for handling the POST request 
router.post('/add', authenticateToken, (req, res) => {
  const menuItems = req.body;
  
  const results = [];
  const errors = [];
  
  menuItems.forEach((item) => {
    const menuItem = {
      id:item.id,
      title:item.title,
      desc: item.desc,
      price: item.price,
      createdAt: DateTime.now().setZone('Europe/Stockholm').toISO(),
    };
    
    menuDB.insert(menuItem, (err, newMenuItem) => {
      if (err) {
        console.error('Error adding menu item:', err);
        errors.push(err);
      } else {
        console.log('Menu item added successfully:', newMenuItem);
        results.push(newMenuItem);
      }
    });
  });
  
  if (errors.length > 0) {
    res.status(500).json({ error: 'Error adding some menu items', errors });
  } else {
    res.status(200).json({ message: 'Menu items added successfully!', results });
  }
});
//update a menuitem
// Define a callback function for handling the PUT request to modify a product by id
router.put('/modify/:id', authenticateToken, (req, res) => {
  const productId = req.params.id; // Get the product id from the URL parameter

  // Extract the updated product details from req.body
  const updatedProduct = {
    id:req.body.id,
    title: req.body.title,
    desc: req.body.desc,
    price: req.body.price,
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


//delete router from databse
router.delete('/remove/:id', authenticateToken, (req, res) => {
  const productId = req.params.id; // Get the product id from the URL parameter

  // Use menuDB.remove to delete the product by id
  menuDB.remove({ _id: productId }, {}, (err, numRemoved) => {
    if (err) {
      console.error('Error removing product:', err);
      res.status(500).json({ error: 'Error removing product' });
    } else if (numRemoved === 0) {
      // If no product was removed, it means the product with that id does not exist
      res.status(404).json({ error: 'Product not found' });
    } else {
      // Product successfully removed
      res.status(200).json({ message: 'Product removed successfully' });
    }
  });
});





module.exports = router;