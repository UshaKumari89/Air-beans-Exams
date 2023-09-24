const express = require('express');
const router = express.Router();
const Datastore = require('nedb');
const { menuDB } = require('./menuItems'); // adjust the path as needed



const promotionsDb = new Datastore({ filename: './databse/promotions.db', autoload: true });

router.post('/add-promotion', async (req, res) => {
    // Assuming the request body contains product names and promotional price
    const { products, promotionalPrice } = req.body;
  
    try {
      // Validate that products exist in the "menudb"
      const existingProducts = await findProductsInMenuDb(products);

  
   // filtering the products with the ".filter()" method to filter out invalid products
   const invalidProducts = products.filter((product) => {
    return !menuDB.findOne({ title: product });
  });
  
  // if there are invalid products, error 400 will be returned indicating that the products are invalid. 
  if (invalidProducts.length > 0) {
    return res.status(400).json({ error: "These aren't the products you're looking for..(Invalid products)" });
  }
  
  // this is to make sure the price is actually a number and higher than 0.
  if (!Number.isFinite(promotionalPrice) ||promotionalPrice <= 0) {
    return res.status(400).json({ error: "The price ain't right (maby not even a number. Try again)" });
  }
  
  
  
      // Create a new promotion object and save it to the "promotionsdb"
      const promotion = {
        products,
        promotionalPrice,
      };
  
      promotionsDb.insert(promotion, (err, newPromotion) => {
        if (err) {
          console.error('Failed to save the promotion:', err);
          return res.status(500).json({ error: 'Failed to save the promotion.' });
        }
        res.status(201).json(newPromotion);
      });
    } catch (error) {
      console.error('An error occurred while processing the request:', error);
      res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
  });
  
  // Helper function to find products in the "menudb"
  function findProductsInMenuDb(productNames) {
    return new Promise((resolve, reject) => {
      menuDB.find({ name: { $in: productNames } }, (err, products) => {
        if (err) {
          reject(err);
        } else {
           resolve(products);
        }
      });
    });
  }
  
  
  module.exports = router;