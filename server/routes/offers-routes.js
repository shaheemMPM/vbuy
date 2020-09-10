const express = require('express');
const { check } = require('express-validator');

const offersController = require('../controllers/offers-controllers');
const checkAuth = require('../middlewares/check-isadmin');

const router = express.Router();

router.use(checkAuth);

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