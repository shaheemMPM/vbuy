const express = require('express');

const productsController = require('../../controllers/mobile/products-controllers');

const router = express.Router();

router.get('/subcategory/:scid', productsController.getProductsBySubcategoryId);
router.get('/:pid', productsController.getProductsById);

module.exports = router;