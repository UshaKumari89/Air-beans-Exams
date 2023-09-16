    const express = require('express');
    const adminRoutes = require('./adminRoute');
    const app = express();

    // for parsing application/json
    app.use(express.json()); 

    app.use('/admin', adminRoutes);
    app.use('/login', adminRoutes);


    app.listen(5044, () => console.log('Server running on port 5044'));