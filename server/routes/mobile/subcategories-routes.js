const express = require('express');

const subcategoriesController = require('../../controllers/mobile/subcategories-controllers');
const checkAuth = require('../../middlewares/check-isuser');

const router = express.Router();

router.use(checkAuth);

router.get('/category/:cid', subcategoriesController.getSubcategoryByCategoryId);

module.exports = router;