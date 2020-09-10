const express = require('express');
const { check } = require('express-validator');

const offersController = require('../controllers/offers-controllers');

const router = express.Router();

router.get('/', offersController.getOffers);

 router.get('/:oid', offersController.getOfferById);

router.post(
  '/',
	[
		check('name').not().isEmpty(),
    check('percentage').not().isEmpty(),
  ],
  offersController.createOffer
);

router.patch(
  '/:oid',
  [
    check('name').not().isEmpty(),
    check('percentage').not().isEmpty()
  ],
  offersController.updateOffer
);

router.delete('/:oid', offersController.deleteOffer);

module.exports = router;
