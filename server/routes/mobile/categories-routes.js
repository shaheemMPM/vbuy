const express = require('express');

const categoriesController = require('../../controllers/mobile/categories-controllers');
const checkAuth = require('../../middlewares/check-isuser');

const router = express.Router();

router.use(checkAuth);

router.get('/shop/:sid', categoriesController.getCategoriesByShopId);

module.exports = router;