const express = require('express');
const { check } = require('express-validator');

const shopsControllers = require('../../controllers/dashboard/shops-controllers');
const checkAuth = require('../../middlewares/check-isadmin');

const router = express.Router();

router.use(checkAuth);

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
