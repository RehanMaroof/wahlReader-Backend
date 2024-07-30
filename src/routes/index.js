const express = require('express');
const usersRoutes = require('./routes.user');
const masterRoutes = require('./routes.master');
const uploadsRoutes = require('./routes.uploads');
const priceRoutes = require('./routes.price');
const reportRoutes = require('./routes.report');
const router = express.Router();

router.get('/', (req, res, next)=>{
    return res.status(200).json({messages: 'The API service is running...'});
});

router.use('/users', usersRoutes);

router.use('/master', masterRoutes);

router.use('/uploads', uploadsRoutes);

router.use('/price', priceRoutes);

router.use('/report', reportRoutes);

module.exports = router;
