const express = require('express');
const { check } = require('express-validator');

const subcategoriesController = require('../../controllers/mobile/subcategories-controllers');

const router = express.Router();

router.get('/category/:cid', subcategoriesController.getSubcategoryByCategoryId);

module.exports = router;