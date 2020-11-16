const express = require('express');
const { check } = require('express-validator');

const ordersController = require('../../controllers/mobile/orders-controllers');
const checkAuth = require('../../middlewares/check-isuser');

const router = express.Router();

router.use(checkAuth);

router.get('/', ordersController.getOrders);

router.get('/:pid', ordersController.getOrderById);

router.post(
  '/',
  [
    check('productDetails.*.productId').not().isEmpty(),
    check('productDetails.*.quantity').not().isEmpty(),
    check('address').not().isEmpty(),
    check('modeOfPayment').not().isEmpty(),
    check('netAmount').not().isEmpty()
  ],
  ordersController.createOrder
);

module.exports = router;