const express = require('express');

const subcategoriesController = require('../../controllers/mobile/subcategories-controllers');

const router = express.Router();

router.get('/category/:cid', subcategoriesController.getSubcategoryByCategoryId);

module.exports = router;