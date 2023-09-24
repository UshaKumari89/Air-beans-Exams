const express = require('express');
const router = express.Router();
const Datastore = require('nedb');
const { DateTime } = require('luxon'); // Import luxon
const { authenticateToken, checkAdminRole  } = require('../middlewire/auth'); // Import your authentication middleware if needed

const menuDB = new Datastore({ filename: './databse/menu.db', autoload: true });
// const promotionsDb = new Datastore({ filename: './databse/promotions.db', autoload: true });



// Define a callback function for handling the POST request 
router.post('/add', authenticateToken,checkAdminRole, (req, res) => {
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
        // console.log('Menu item added successfully:', newMenuItem);
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
 router.put('/modify/:id', authenticateToken, checkAdminRole, (req, res) => {
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
      //console.log('Product modified successfully:', productId);
      res.status(200).json({ message: 'Product modified successfully' });
    }
  });
});


//delete router from databse
router.delete('/delete/:id', authenticateToken, checkAdminRole, (req, res) => {
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





// router.post('/add-promotion', async (req, res) => {
//   console.log('Route triggered');
//   // Assuming the request body contains product names and promotional price
//   const { products, promotionalPrice } = req.body;

//   try {
//     // Validate that products exist in the "menudb"
//     const existingProducts = await findProductsInMenuDb(products);
//     console.log('Received products:', products);

//  // filtering the products with the ".filter()" method to filter out invalid products
//  const invalidProducts = products.filter((product) => {
//   return !menuDB.findOne({ title: product });
// });

// // if there are invalid products, error 400 will be returned indicating that the products are invalid. 
// if (invalidProducts.length > 0) {
//   return res.status(400).json({ error: "These aren't the products you're looking for..(Invalid products)" });
// }

// // this is to make sure the price is actually a number and higher than 0.
// if (!Number.isFinite(promotionalPrice) ||promotionalPrice <= 0) {
//   return res.status(400).json({ error: "The price ain't right (maby not even a number. Try again)" });
// }



//     // Create a new promotion object and save it to the "promotionsdb"
//     const promotion = {
//       products,
//       promotionalPrice,
//     };

//     promotionsDb.insert(promotion, (err, newPromotion) => {
//       if (err) {
//         console.error('Failed to save the promotion:', err);
//         return res.status(500).json({ error: 'Failed to save the promotion.' });
//       }

//       console.log('Promotion saved:', newPromotion);
//       res.status(201).json(newPromotion);
//     });
//   } catch (error) {
//     console.error('An error occurred while processing the request:', error);
//     res.status(500).json({ error: 'An error occurred while processing the request.' });
//   }
// });

// // Helper function to find products in the "menudb"
// function findProductsInMenuDb(productNames) {
//   return new Promise((resolve, reject) => {
//     menuDB.find({ name: { $in: productNames } }, (err, products) => {
//       if (err) {
//         console.error('Error while fetching products from menuDB:', err);
//         reject(err);
//       } else {
//         console.log('Products found in menuDB:', products.map(p => p.name));
//         resolve(products);
//       }
//     });
//   });
// }


module.exports = { router, menuDB };