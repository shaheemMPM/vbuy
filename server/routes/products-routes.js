const express = require('express');
const { check } = require('express-validator');

const productsController = require('../controllers/products-controllers');
const checkAuth = require('../middlewares/check-isadmin');

const router = express.Router();

router.use(checkAuth);

router.get('/', productsController.getProducts);

router.get('/:pid', productsController.getProductsById);

router.post(
  '/',
  [
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
    check('amount').not().isEmpty(),
    check('batchCode').not().isEmpty(),
    check('subcategoryId').not().isEmpty()
  ],
  productsController.createProduct
);

router.patch(
  '/:pid',
  [
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
    check('amount').not().isEmpty(),
    check('batchCode').not().isEmpty()
  ],
  productsController.updateProduct
);

router.delete('/:pid', productsController.deleteProduct);

module.exports = router;

module.exports = router;