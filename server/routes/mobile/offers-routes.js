const express = require('express');

const offersController = require('../../controllers/mobile/offers-controller');

const router = express.Router();

router.get('/', offersController.getOffers);

router.get('/products/:oid', offersController.getProducts);

module.exports = router;