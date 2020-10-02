const express = require('express');

const homeControllers = require('../../controllers/mobile/home-controllers');

const router = express.Router();

router.get('/', homeControllers.getPopularProductsAndOffers);

module.exports = router;