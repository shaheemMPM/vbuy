const express = require('express');
const { check } = require('express-validator');

const ordersController = require('../../controllers/mobile/orders-controllers');
const checkAuth = require('../../middlewares/check-isuser');

const router = express.Router();

router.use(checkAuth);

router.get('/', ordersController.getProducts);

router.get('/:pid', ordersController.getProductsById);

router.post(
  '/',
  [
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
    check('amount').not().isEmpty(),
    check('batchCode').not().isEmpty(),
    check('subcategoryId').not().isEmpty(),
    check('sgst').not().isEmpty(),
    check('cgst').not().isEmpty(),
  ],
  ordersController.createProduct
);

module.exports = router;