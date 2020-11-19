const express = require('express');
const { check } = require('express-validator');

const orderControllers = require('../../controllers/dashboard/order-controllers');

const router = express.Router();

router.get('/', orderControllers.getOrders);

router.get('/:oid', orderControllers.getOrderById);

router.get('/status/:status', orderControllers.getOrdersByStatus);

router.patch(
    '/status/:oid', 
    [
        check('status').not().isEmpty()
    ],
    orderControllers.updateOrderStatus
);

module.exports = router;
