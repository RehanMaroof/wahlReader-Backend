const express = require('express');

const { MDWR } = require('../middlewares');
const { SCHEMA } = require('../validators/validation');
const priceController = require('../controllers/price.controller');

const priceRoutes = express.Router();

priceRoutes.post('/v1/get-price', MDWR.validateAccessToken(), priceController.GETPRICE);

module.exports = priceRoutes