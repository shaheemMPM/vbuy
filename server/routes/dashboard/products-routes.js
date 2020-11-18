const express = require('express');
const { check } = require('express-validator');

const productsController = require('../../controllers/dashboard/products-controllers');
const checkAuth = require('../../middlewares/check-isadmin');

const router = express.Router();

router.use(checkAuth);

router.get('/', productsController.getProducts);

router.get('/:pid', productsController.getProductsById);

router.get('/subcategory/:scid', productsController.getProductsBySubcategoryId);

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
  productsController.createProduct
);

router.patch(
  '/:pid',
  [
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
    check('amount').not().isEmpty(),
    check('batchCode').not().isEmpty(),
    check('sgst').not().isEmpty(),
    check('cgst').not().isEmpty(),
  ],
  productsController.updateProduct
);


router.delete('/:pid', productsController.deleteProduct);

router.patch('/popular/add/:pid', productsController.addProductPopular);

router.patch('/popular/remove/:pid', productsController.removeProductPopular);

router.patch('/size/:pid', productsController.updateSizeChart);

router.patch('/pincode/:pid', productsController.updatePinCode);

router.patch('/images/:pid', productsController.updateImages);

router.patch('/statustoggle/:pid', productsController.toggleStatus);

module.exports = router;