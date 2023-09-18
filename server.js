const express = require('express');
const adminRoutes = require('./router/adminRoute');
const menuRoutes = require('./router/menuItems');
const userRoutes = require('./router/usersRoute');
//const { testToken } = require('./authentication');

const app = express();
//testToken();
// for parsing application/json
app.use(express.json()); 

// This will prepend '/admin' to all routes in your adminRoutes file
app.use('/admin', adminRoutes); 

// This will prepend '/admin/menu' to all routes in your menuRoutes file
app.use('/admin/menu', menuRoutes); 

app.use('/users', userRoutes); 

app.listen(5044, () => console.log('Server running on port 5044'));