const express = require('express');

const offersController = require('../../controllers/mobile/offers-controller');

const router = express.Router();

router.get('/shop/:sid', offersController.getOffersByShopId);

router.get('/products/:oid', offersController.getProducts);

module.exports = router;