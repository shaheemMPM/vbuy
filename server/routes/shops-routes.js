const express = require('express');
const { check } = require('express-validator');

const shopsControllers = require('../controllers/shops-controllers');

const router = express.Router();

router.get('/', shopsControllers.getShops);

router.get('/:sid', shopsControllers.getShopById);

router.post(
  '/',
  [
    check('name').not().isEmpty(),
    check('image').not().isEmpty(),
    check('branch').not().isEmpty()
  ],
  shopsControllers.createShop
);

router.patch(
  '/:sid',
  [
    check('name').not().isEmpty(),
    check('image').not().isEmpty(),
    check('branch').not().isEmpty()
  ],
  shopsControllers.updateShop
);

router.delete('/:sid', shopsControllers.deleteShop);

module.exports = router;
