const express = require('express');

const offersController = require('../../controllers/mobile/offers-controller');
const checkAuth = require('../../middlewares/check-isuser');

const router = express.Router();

router.use(checkAuth);

router.get('/shop/:sid', offersController.getOffersByShopId);

router.get('/products/:oid', offersController.getProducts);

module.exports = router;