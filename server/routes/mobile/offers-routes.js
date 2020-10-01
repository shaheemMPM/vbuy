const express = require('express');

const offersController = require('../../controllers/mobile/offers-controller');

const router = express.Router();

router.get('/', offersController.getOffers);

module.exports = router;