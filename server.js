const express = require('express');
const adminRoutes = require('./router/adminRoute');
// const menuRoutes = require('./router/menuItems'); // This imports both router and menuDB
const userRoutes = require('./router/usersRoute');
const promotionRoutes = require('./router/promotionRoute');
const { router: menuRoutes } = require('./router/menuItems');

const app = express();
//testToken();
// for parsing application/json
app.use(express.json()); 

// This will prepend '/admin' to all routes in your adminRoutes file
app.use('/admin', adminRoutes); 


// This will prepend '/admin/menu' to all routes in your menuRoutes file
app.use('/admin/menu', menuRoutes);

app.use('/users', userRoutes); 

app.use('/promotions', promotionRoutes);
app.listen(5044, () => console.log('Server running on port 5044'));