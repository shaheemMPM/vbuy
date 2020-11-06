const express = require('express');
const { check } = require('express-validator');

const offersController = require('../../controllers/dashboard/offers-controllers');
const checkAuth = require('../../middlewares/check-isadmin');

const router = express.Router();

router.use(checkAuth);

router.get('/', offersController.getOffers);

router.get('/shop/:sid', offersController.getOffersByShopId);

router.get('/:oid', offersController.getOfferById);

router.post(
  '/',
	[
		check('name').not().isEmpty(),
    check('percentage').not().isEmpty(),
    check('shopId').not().isEmpty(),
    check('image').not().isEmpty()
  ],
  offersController.createOffer
);

router.patch(
  '/:oid',
  [
    check('name').not().isEmpty(),
    check('percentage').not().isEmpty(),
    check('image').not().isEmpty()
  ],
  offersController.updateOffer
);

router.delete('/:oid', offersController.deleteOffer);

router.post('/add/:oid/:pid', offersController.addProduct);

router.delete('/remove/:oid/:pid', offersController.removeProduct);

module.exports = router;
