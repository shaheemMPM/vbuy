const express = require('express');

const categoriesController = require('../../controllers/mobile/categories-controllers');

const router = express.Router();

router.get('/shop/:sid', categoriesController.getCategoriesByShopId);

module.exports = router;