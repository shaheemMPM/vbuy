const express = require('express');

const productsController = require('../../controllers/mobile/products-controllers');
const checkAuth = require('../../middlewares/check-isuser');

const router = express.Router();

router.use(checkAuth);

router.get('/subcategory/:scid', productsController.getProductsBySubcategoryId);
router.get('/:pid', productsController.getProductsById);
router.get('/popular/:sid', productsController.getPopularProductsByShopId);

module.exports = router;